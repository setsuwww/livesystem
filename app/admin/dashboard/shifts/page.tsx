import { DashboardHeader } from "../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { ShiftsRealtime } from "./ShiftsRealtime";
import { prisma } from "@/lib/prisma";

async function getAllShifts() {
  return await prisma.shift.findMany({
    include: {
      users: { select: { id: true, name: true, email: true } },
      schedules: { select: { id: true, title: true } },
    },
    orderBy: { id: "desc" },
  });
}

export const revalidate = 60;

export default async function ShiftsPage() {
  const initialData = await getAllShifts();

  return (
    <section>
      <DashboardHeader title="Shifts" subtitle="Manage shifts data" />
      <ContentForm>
        <ContentInformation heading="List shifts" subheading="Manage all shift data in this table"/>

        <ShiftsRealtime initialData={initialData} />
      </ContentForm>
    </section>
  );
}
