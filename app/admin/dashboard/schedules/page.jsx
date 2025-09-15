import { prisma } from "@/lib/prisma";

import { Clock } from "lucide-react";
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
          <div className="flex items-center space-x-2 mt-4">
            <div className="flex items-center space-x-2 bg-green-100 border border-green-200 px-2 py-0.5 rounded-md">
              <span className="text-green-700 text-sm font-base">Daily</span>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-100 border border-yellow-200 px-2 py-0.5 rounded-md">
              <span className="text-yellow-700 text-sm font-base">Weekly</span>
            </div>
            <div className="flex items-center space-x-2 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-md">
              <span className="text-orange-700 text-sm font-base">Monthly</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md">
              <span className="text-purple-700 text-sm font-base">Yearly</span>
            </div>
            <div className="flex items-center space-x-2 bg-red-100 border border-red-200 px-2 py-0.5 rounded-md">
              <span className="text-red-700 text-sm font-base">Once</span>
            </div>
          </div>
        </ContentForm.Header>

        <ContentForm.Body>
          <ScheduleTable data={schedules} />
        </ContentForm.Body>

        <Pagination page={page} totalPages={totalPages} basePath="/admin/dashboard/schedules" />
      </ContentForm>
    </section>
  );
}
