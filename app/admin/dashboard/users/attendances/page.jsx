import { prisma } from "@/lib/prisma";
import { ContentInformation } from "@/components/content/ContentInformation";
import ContentForm from "@/components/content/ContentForm";
import { DashboardHeader } from "../../DashboardHeader";
import { Pagination } from "../../Pagination";
import { ShiftCards } from "../../shifts/ShiftsCard";
import AttendancesTable from "./AttendancesTable";

const PAGE_SIZE = 5;

async function getAttendanceData(page = 1) {
  const [attendances, total] = await prisma.$transaction([
    prisma.attendance.findMany({ skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        user: { select: { id: true, name: true, email: true } },
        shift: { select: { id: true, type: true, startTime: true, endTime: true } },
      },
      orderBy: { date: "desc" },
    }),
    prisma.attendance.count(),
  ]);

  return { attendances, total };
}

async function getShifts() {
  const today = new Date(new Date().setHours(0, 0, 0, 0));

  const shifts = await prisma.shift.findMany({
    include: { users: { select: {
          id: true, name: true, email: true,
          attendances: { where: { date: { gte: today } },
            select: { status: true },
            take: 1,
          },
        },
      },
    },
  });

  return shifts.map((shift) => ({ id: shift.id,
    type: shift.type, startTime: shift.startTime.toISOString(), endTime: shift.endTime.toISOString(),
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
    date: a.date.toISOString(),
    checkOutTime: a.checkOutTime?.toISOString() ?? null,
    checkInTime: a.checkInTime?.toISOString() ?? null,
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
        <ContentForm.Header>
          <ContentInformation heading="Shift Overview" subheading="View attendance by shift" />
        </ContentForm.Header>

        <ContentForm.Body>
          <ShiftCards shifts={shifts} />

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
