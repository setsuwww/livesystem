import ContentForm from "@/components/content/ContentForm";
import { DashboardHeader } from "../DashboardHeader";
import { ContentInformation } from "@/components/content/ContentInformation";
import { ShiftsTable } from "./ShiftsTable";
import { prisma } from "@/lib/prisma";

<<<<<<< HEAD
import { minutesToTime } from "@/function/services/shiftAttendance"
=======
import { minutesToTime } from "@/function/services/shiftAttendance";
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf

export const revalidate = 60;

export default async function ShiftsPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  // Ambil semua shift utama
  const mainShifts = await prisma.shift.findMany({
    where: { type: { in: ["MORNING", "AFTERNOON", "EVENING"] } },
    select: {
      id: true,
      type: true,
<<<<<<< HEAD
=======
      shiftName: true,
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
      startTime: true,
      endTime: true,
      users: {
        where: { role: "EMPLOYEE" },
        select: {
          id: true,
          name: true,
          email: true,
          attendances: {
            select: { shiftId: true, status: true, reason: true },
          },
        },
      },
      schedules: { select: { id: true, title: true } },
    },
    orderBy: { type: "asc" },
  });

<<<<<<< HEAD
=======
  // Mapping agar setiap user punya status default ABSENT
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
  const tableData = mainShifts.map((s) => {
    const start = minutesToTime(s.startTime);
    const end = minutesToTime(s.endTime);

<<<<<<< HEAD
    return {
      id: s.id,
      type: s.type,
      timeRange: `${start} - ${end}`,
      usersCount: s.users.length,
      schedulesCount: s.schedules.length,
      users: s.users.map((u) => ({
        ...u,
        attendances: u.attendances.filter((a) => a.shiftId === s.id),
      })),
=======
    const usersWithStatus = s.users.map((u) => {
      // cek attendance untuk shift ini
      const attendance = u.attendances.find((a) => a.shiftId === s.id);
      return {
        ...u,
        attendanceStatus: attendance ? attendance.status : "ABSENT", // default ABSENT
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
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
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
