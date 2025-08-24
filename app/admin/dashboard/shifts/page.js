// app/admin/dashboard/shifts/page.jsx
import ContentForm from "@/components/content/ContentForm";
import { DashboardHeader } from "../DashboardHeader";
import { ContentInformation } from "@/components/content/ContentInformation";
import { ShiftsTable } from "./ShiftsTable";
import { ShiftCards } from "./ShiftsCard";
import { prisma } from "@/lib/prisma";
import { formatTimeRange, toDateFromTimeString } from "@/function/handleTime";

export default async function ShiftsPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  // Ambil semua shift utama
  const mainShifts = await prisma.shift.findMany({
    where: { type: { in: ["MORNING", "AFTERNOON", "NIGHT"] } },
    select: {
      id: true,
      type: true,
      startTime: true,
      endTime: true,
      users: {
        where: { role: "EMPLOYEE" },
        select: { id: true, name: true, email: true, 
          attendances: {
            where: { shiftId: undefined }, // nanti diisi shift.id
            select: { status: true, reason: true }
          }
        },
      },
      schedules: { select: { id: true, title: true } },
    },
    orderBy: { type: "asc" },
  });

  const tableData = mainShifts.map((s) => {
    const start = toDateFromTimeString(s.startTime);
    const end = toDateFromTimeString(s.endTime);

    return {
      id: s.id,
      type: s.type,
      timeRange: formatTimeRange(start, end),
      usersCount: s.users.length,
      schedulesCount: s.schedules.length,
      users: s.users,
    };
  });

  return (
    <section className="space-y-6">
      <DashboardHeader title="Shifts" subtitle="Manage shifts data" />
      <ContentForm>
        <ContentInformation heading="List shifts" subheading="Manage all shift data in this table" />
        <ShiftsTable data={tableData} />
        <ShiftCards shifts={mainShifts} />
      </ContentForm>
    </section>
  );
}
