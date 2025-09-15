import { prisma } from "@/lib/prisma";

import ScheduleTable from "./SchedulesTable";
import { DashboardHeader } from "../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Pagination } from "../Pagination";

const PAGE_SIZE = 5;

export async function getSchedules(page = 1) {
  return await prisma.schedule.findMany({
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      startDate: true,
      endDate: true,
      frequency: true,
      userId: true,
      shiftId: true,
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
    orderBy: { date: "asc" },
  });
}


export async function getScheduleCount() {
  return await prisma.schedule.count();
}

export const revalidate = 60;

export default async function Page({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  const [schedulesRaw, total] = await Promise.all([
    getSchedules(page),
    getScheduleCount(),
  ]);

  const schedules = schedulesRaw.map(s => ({
    ...s,
    date: s.date?.toISOString() ?? null,
    startDate: s.startDate?.toISOString() ?? null,
    endDate: s.endDate?.toISOString() ?? null,
    createdAt: s.createdAt?.toISOString() ?? null,
    updatedAt: s.updatedAt?.toISOString() ?? null,
    shift: s.shift
    ? {
        ...s.shift,
        startTime: s.shift.startTime,
        endTime: s.shift.endTime,
      }
    : null,
  }));

  const totalPages = Math.ceil(total / 5);

  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>;
  }

  return (
    <section>
      <DashboardHeader title="Schedules" subtitle="List of your schedules" />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation heading="Schedule table" subheading="Manage schedule more detail than calendar view" />
        </ContentForm.Header>

        <ContentForm.Body>
          <ScheduleTable data={schedules}/>
        </ContentForm.Body>

        <Pagination page={page} totalPages={totalPages} basePath="/admin/dashboard/schedules" />
      </ContentForm>
    </section>
  );
}
