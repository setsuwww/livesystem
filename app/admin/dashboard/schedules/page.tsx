import { prisma } from "@/lib/prisma";

import ScheduleTable from "./SchedulesTable";
import { DashboardHeader } from "../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import ContentInformation from "@/components/content/ContentInformation";

export async function getSchedules() {
  return await prisma.schedule.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      userId: true,
      shiftId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { date: "asc" },
  });
}

export default async function Page() {
  const schedulesRaw = await getSchedules();

  const schedules = schedulesRaw.map(s => ({
    ...s,
    date: s.date.toISOString(),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    shiftId: s.shiftId ?? null,
  }));

  return (
    <section>
      <DashboardHeader title="Schedules" subtitle="List of your schedules" />
      <ContentForm>
        <ContentInformation heading="Schedule table" subheading="Manage schedule more detail than calendar view" />
        <ScheduleTable data={schedules} />
      </ContentForm>
    </section>
  );
}
