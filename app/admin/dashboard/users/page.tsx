import UsersTable from "./UsersTable"
import { DashboardHeader } from './../DashboardHeader';
import ContentForm from '@/components/content/ContentForm';
import ContentInformation from '@/components/content/ContentInformation';

import { capitalize } from "../../../../function/functionCapitalize";
import { prisma } from "@/lib/prisma"
import { Pagination } from "../Pagination";

const PAGE_SIZE = 5;

async function getUsers(page: number = 1) {
  return await prisma.user.findMany({
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      shift: {
        select: {
          id: true,
          type: true,
          startTime: true,
          endTime: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getUserCount() {
  return await prisma.user.count();
}

export const revalidate = 60;

export default async function Page({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page) || 1;

  const [users, total] = await Promise.all([
    getUsers(page),
    getUserCount(),
  ]);

  const tableData = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: capitalize(u.role),
    shift: u.shift
      ? (() => {
          const start = u.shift.startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          });
          const end = u.shift.endTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          });
          return `${capitalize(u.shift.type)} (${start} - ${end})`;
        })()
      : "-",
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>;
  }

  return (
    <section>
      <DashboardHeader title="Users" subtitle="Users data detail" />
      <ContentForm>
        <ContentInformation heading="List users" subheading="Manage all users data in this table" />
        <UsersTable data={tableData} />

        <Pagination page={page} totalPages={totalPages} basePath="/admin/dashboard/users" />
      </ContentForm>
    </section>
  )
}