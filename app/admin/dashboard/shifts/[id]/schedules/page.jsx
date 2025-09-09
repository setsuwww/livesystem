import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "../../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Pagination } from "../../../Pagination";
import ScheduleTable from "./ShiftScheduleTable";

import { capitalize } from "@/function/globalFunction";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ContentForm from '@/components/content/ContentForm';

export const revalidate = 60;

export default async function ShiftUsersPage({
  params,
  searchParams
}) {
  const shiftId = parseInt(params.id);
  const page = Number(searchParams?.page) || 1;
  const PAGE_SIZE = 10;

  const [shift, totalUsers] = await Promise.all([
    prisma.shift.findUnique({
      where: { id: shiftId },
      include: { users: true },
    }),
    prisma.schedule.count({
      where: { shiftId },
    }),
  ]);

  if (!shift) return <div className="p-4">Shift not found</div>;

  const schedulesData = await prisma.schedule.findMany({
    where: { shiftId },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const schedulesDataMapped = schedulesData.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    date: s.date.toISOString(),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    shift: shift.type,
  }));

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  const title = capitalize(shift.type)

  return (
    <section>
      <DashboardHeader title={`${title} schedules`} subtitle="Manage shift users" />
      <ContentForm>
        <ContentForm.Header>
        <ContentInformation heading={`${title} shift schedules`} subheading={`View all schedules on this shift`} />
        <Link href="/admin/dashboard/schedules" className="flex items-center text-sm font-semibold text-blue-500 my-2">
          Schedule detail <ChevronRight strokeWidth={2} size={20} />
        </Link>
        </ContentForm.Header>

        <ContentForm.Body>
        <ScheduleTable data={schedulesDataMapped} />
        </ContentForm.Body>

        <Pagination page={page} totalPages={totalPages} basePath={`/admin/dashboard/shifts/${shiftId}`} />
      </ContentForm>
    </section>
  );
}
