import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Pagination } from "@/app/admin/dashboard/Pagination";
import UsersTable from "./ShiftUserTable";

import { capitalize } from "@/function/functionCapitalize";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

interface ShiftUsersPageProps {
  params: { id: string };
  searchParams?: { page?: string };
}

export default async function ShiftUsersPage({ params, searchParams }: ShiftUsersPageProps) {
  const shiftId = parseInt(params.id);
  const page = Number(searchParams?.page) || 1;
  const PAGE_SIZE = 10;

  const [shift, totalUsers] = await Promise.all([
    prisma.shift.findUnique({
      where: { id: shiftId },
      include: { users: true },
    }),
    prisma.user.count({
      where: { shiftId },
    }),
  ]);

  if (!shift) return <div className="p-4">Shift not found</div>;

  const usersData = await prisma.user.findMany({
    where: { shiftId },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const usersDataMapped = usersData.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    shift: shift.type,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  const title = capitalize(shift.type)

  return (
    <section>
      <DashboardHeader title={`${title} users`} subtitle="Manage shift users" />
      <ContentForm>
        <ContentInformation heading={`${title} shift users`} subheading={`View all users in this shift`} />

        <Link href="/admin/dashboard/users" className="flex items-center text-sm font-semibold text-blue-500 my-2">
          Users detail <ChevronRight strokeWidth={2} size={20} />
        </Link>

        <UsersTable data={usersDataMapped} />

        <Pagination page={page} totalPages={totalPages} basePath={`/admin/dashboard/shifts/${shiftId}`} />
      </ContentForm>
    </section>
  );
}
