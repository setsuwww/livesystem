import ContentForm from "@/components/content/ContentForm";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { ContentInformation } from "@/components/content/ContentInformation";
import { ShiftsView } from "./ShiftsView";
import { prisma } from "@/lib/prisma";

import { minutesToTime } from "@/function/services/shiftAttendance";

export const revalidate = 60;

export default async function ShiftsPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  const mainShifts = await prisma.shift.findMany({
    where: { type: { in: ["MORNING", "AFTERNOON", "EVENING"] } },
    select: {
      id: true, type: true, name: true,
      startTime: true, endTime: true,
      users: {
        select: { id: true, name: true, email: true,
          attendances: {
            select: { shiftId: true, status: true, reason: true },
          },
        },
      },
      assignments: {
        include: {
          user: {
            select: { id: true, name: true, email: true,
              attendances: {
                select: { shiftId: true, status: true, reason: true },
              },
            },
          },
        },
      },
      office: {
        select: { name: true }
      }
    },
    orderBy: { type: "asc" },
  });

const tableData = mainShifts.map((s) => {
  const start = minutesToTime(s.startTime);
  const end = minutesToTime(s.endTime);

  const allUsers = [...s.users, ...s.assignments.map((a) => a.user)];

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
    name: s.name,
    startTime: start,
    endTime: end,
    timeRange: `${start} - ${end}`,
    usersCount: usersWithStatus.length,
    users: usersWithStatus,
    office: s.office ? s.office.name : "-", // ✅ Masukin office name di sini
  };
});


  return (
    <section className="space-y-6">
      <DashboardHeader title="Shifts" subtitle="Manage shifts data" />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation heading="List shifts" subheading="Manage all shift data in this table"
            show={true} buttonText="Add Shift" href="/admin/dashboard/shifts/create"
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <ShiftsView data={tableData} />
        </ContentForm.Body>
      </ContentForm>
    </section>
  );
}
