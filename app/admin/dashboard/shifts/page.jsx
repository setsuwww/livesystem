import ContentForm from "@/components/content/ContentForm";
import { DashboardHeader } from "../DashboardHeader";
import { ContentInformation } from "@/components/content/ContentInformation";
import { ShiftsTable } from "./ShiftsTable";
import { prisma } from "@/lib/prisma";

import { minutesToTime } from "@/function/services/shiftAttendance";

export const revalidate = 60;

export default async function ShiftsPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  // Ambil semua shift utama
  const mainShifts = await prisma.shift.findMany({
  where: { type: { in: ["MORNING", "AFTERNOON", "EVENING", "OFF"] } },
  select: {
    id: true,
    type: true,
    shiftName: true,
    startTime: true,
    endTime: true,
    // ambil user default
    users: {
      select: {
        id: true,
        name: true,
        email: true,
        attendances: {
          select: { shiftId: true, status: true, reason: true },
        },
      },
    },
    // ambil user dari pivot
    assignments: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            attendances: {
              select: { shiftId: true, status: true, reason: true },
            },
          },
        },
      },
    },
    schedules: { select: { id: true, title: true } },
  },
  orderBy: { type: "asc" },
});



  // Mapping agar setiap user punya status default ABSENT
  const tableData = mainShifts.map((s) => {
  const start = minutesToTime(s.startTime);
  const end = minutesToTime(s.endTime);

  // gabung default + pivot
  const allUsers = [
    ...s.users,
    ...s.assignments.map((a) => a.user),
  ];

  // hapus duplikat (jaga2 kalau 1 user ada di dua relasi)
  const uniqueUsers = Array.from(
    new Map(allUsers.map((u) => [u.id, u])).values()
  );

  const usersWithStatus = uniqueUsers.map((u) => {
    const attendance = u.attendances.find((at) => at.shiftId === s.id);
    return {
      ...u,
      attendanceStatus: attendance ? attendance.status : "ABSENT",
      reason: attendance?.reason || null,
    };
  });

  return {
    id: s.id,
    type: s.type,
    shiftName: s.shiftName,
    startTime: start,
    endTime: end,
    timeRange: `${start} - ${end}`,
    usersCount: usersWithStatus.length,
    schedulesCount: s.schedules.length,
    users: usersWithStatus,
  };
});

  return (
    <section className="space-y-6">
      <DashboardHeader title="Shifts" subtitle="Manage shifts data" />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation heading="List shifts" subheading="Manage all shift data in this table" />
        </ContentForm.Header>

        <ContentForm.Body>
          <ShiftsTable data={tableData} />
        </ContentForm.Body>
      </ContentForm>
    </section>
  );
}
