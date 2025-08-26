import { prisma } from "@/lib/prisma";
import { capitalize, formatTimeRange } from "@/function/handleTime";
import { ContentInformation } from "@/components/content/ContentInformation";
import ContentForm from "@/components/content/ContentForm";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { Pagination } from "@/app/admin/dashboard/Pagination";
import ShiftCards from "../../shifts/ShiftsCard";
import AttendancesTable from './AttendancesTable';

const PAGE_SIZE = 5;

async function getAttendances(page = 1) {
  return await prisma.attendance.findMany({
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      shift: {
        select: { id: true, type: true, startTime: true, endTime: true },
      },
    },
    orderBy: { date: "desc" },
  });
}

async function getAttendanceCount() {
  return await prisma.attendance.count();
}

async function getShifts() {
  const shifts = await prisma.shift.findMany({
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          attendances: {
            where: {
              date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)), // Hari ini
              },
            },
            select: {
              status: true,
            },
            take: 1, // Ambil kehadiran terbaru
          },
        },
      },
    },
  });

  return shifts.map((shift) => ({
    id: shift.id,
    type: shift.type,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime.toISOString(),
    users: shift.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      attendanceStatus: user.attendances[0]?.status || "PRESENT", // Default ke PRESENT jika tidak ada
    })),
  }));
}

export const revalidate = 60;

export default async function AttendancesPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  const [attendances, total, shifts] = await Promise.all([
    getAttendances(page),
    getAttendanceCount(),
    getShifts(),
  ]);

  const serializedAttendances = attendances.map((a) => ({
    ...a,
    date: a.date.toISOString(),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    shift: a.shift
      ? {
          ...a.shift,
          startTime: a.shift.startTime.toISOString(),
          endTime: a.shift.endTime.toISOString(),
        }
      : null,
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>;
  }

  return (
    <section>
      <DashboardHeader title="Attendances" subtitle="Employees attendance records" />
      <ContentForm>
        <ContentInformation
          heading="Shift Overview"
          subheading="View attendance by shift"
        />
        <ShiftCards shifts={shifts} />
        <ContentInformation
          heading="List Attendances"
          subheading="Manage and review all attendance records"
        />
        <AttendancesTable data={serializedAttendances} />
        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/admin/dashboard/attendances"
        />
      </ContentForm>
    </section>
  );
}