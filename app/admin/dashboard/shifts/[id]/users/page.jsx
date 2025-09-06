import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "../../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Pagination } from "../../../Pagination";
import UsersTable from "./ShiftUserTable";

import { capitalize } from "@/function/globalFunction";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

export default async function ShiftUsersPage({ params, searchParams }) {
  const shiftId = parseInt(params.id);
  const page = Number(searchParams?.page) || 1;
  const PAGE_SIZE = 10;

  const [shift, totalUsers] = await Promise.all([
    prisma.shift.findUnique({
      where: { id: shiftId },
      include: { users: { where: { role: "EMPLOYEE" } }},
    }),
    prisma.user.count({ where: { shiftId, role: "EMPLOYEE" } }),
  ]);

  if (!shift) return <div className="p-4">Shift not found</div>;

  const usersData = await prisma.user.findMany({ where: { shiftId, role: "EMPLOYEE" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const usersDataMapped = usersData.map(u => ({
    id: u.id, name: u.name, email: u.email, 
    role: u.role, 
    shift: shift.type,
    createdAt: u.createdAt, updatedAt: u.updatedAt,
  }));

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);
  const title = capitalize(shift.type);

  return (
    <section>
      <DashboardHeader title={`${title} shifts`} subtitle="Manage shift employees" />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation heading={`${title} shift`} subheading={`View all employees in this shift`} />
          <Link href="/admin/dashboard/users" className="flex items-center text-sm font-semibold text-blue-500 mb-2">
            Users detail <ChevronRight strokeWidth={2} size={20} />
          </Link>
        </ContentForm.Header>

        <ContentForm.Body>
          <UsersTable data={usersDataMapped} />
        </ContentForm.Body>

        <Pagination page={page} totalPages={totalPages} basePath={`/admin/dashboard/shifts/${shiftId}`} />
      </ContentForm>
    </section>
  );
}
