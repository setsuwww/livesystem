import { prisma } from "@/_lib/prisma";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import ContentForm from "@/_components/content/ContentForm";
import { ContentInformation } from "@/_components/content/ContentInformation";
import { Pagination } from "@/app/admin/dashboard/Pagination";
import { AttendancesCard } from "./AttendancesCard";
import AttendancesTable from "./AttendancesTable";
import { minutesToTime } from "@/_function/services/shiftAttendanceHelpers";
import { safeToISOString } from "@/_function/globalFunction";

const PAGE_SIZE = 5;

// Ambil attendance paginated
async function getAttendanceData(page = 1) {
  const [attendances, total] = await prisma.$transaction([
    prisma.attendance.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        user: { select: { id: true, name: true, email: true } },
        shift: { select: { id: true, name: true, type:true, startTime: true, endTime: true, officeId: true } },
      },
      orderBy: { date: "desc" },
    }),
    prisma.attendance.count(),
  ]);

  return { attendances, total };
}

// Ambil shift beserta users & attendance hari ini
async function getShifts() {
  const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

  const allowedShiftTypes = ["MORNING", "AFTERNOON", "EVENING"];

  const shifts = await prisma.shift.findMany({
    where: { name: { in: allowedShiftTypes } },
    include: {
      office: { select: { id: true, name: true } },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          attendances: {
  where: {
    date: {
      gte: startOfDay,
      lte: endOfDay,
    },
  },
  select: { status: true },
  take: 1,
},
        },
      },
    },
  });

  return shifts.map((shift) => ({
    id: shift.id,
    name: shift.name,
    type: shift.type,
    officeName: shift.office?.name || "-",
    startTime: minutesToTime(shift.startTime),
    endTime: minutesToTime(shift.endTime),
    users: shift.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      attendanceStatus: user.attendances[0]?.status || "PRESENT",
    })),
  }));
}

export const revalidate = 60;

export default async function AttendancesPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  const [{ attendances, total }, shifts] = await Promise.all([
    getAttendanceData(page),
    getShifts(),
  ]);

  const serializedAttendances = attendances.map((a) => ({
    ...a,
    date: safeToISOString(a.date),
    checkOutTime: safeToISOString(a.checkOutTime),
    checkInTime: safeToISOString(a.checkInTime),
    createdAt: safeToISOString(a.createdAt),
    updatedAt: safeToISOString(a.updatedAt),
    shift: a.shift
      ? {
          id: a.shift.id,
          name: a.shift.name,
          type: a.shift.type,
          startTime: minutesToTime(a.shift.startTime),
          endTime: minutesToTime(a.shift.endTime),
        }
      : null,
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>;
  }

  return (
    <section>
      <DashboardHeader
        title="Attendances"
        subtitle="Employees attendance records"
      />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation
            heading="Shift Overview"
            subheading="View attendance by shift"
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <AttendancesCard shifts={shifts} />

          <div className="my-8">
            <ContentInformation
              heading="List Attendances"
              subheading="Manage and review all attendance records"
            />
          </div>

          <AttendancesTable data={serializedAttendances} />
        </ContentForm.Body>

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/admin/dashboard/attendances"
        />
      </ContentForm>
    </section>
  );
}
