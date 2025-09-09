import { prisma } from "@/lib/prisma";
import { OfficeShiftsCards } from "../ShiftsCard";

export default async function OfficePage({ params }) {
  const officeId = parseInt(params.id);

  const office = await prisma.office.findUnique({
    where: { id: officeId },
    include: {
      shifts: {
        include: {
          users: {
            include: {
              attendances: true,
            },
          },
        },  
      },
    },
  });

  if (!office) return <p>Office not found</p>;

  const shiftsWithAttendance = office.shifts.map((shift) => {
    const usersWithStatus = shift.users.map((user) => {
      const today = new Date();
      const attendance = user.attendances.find(
        (a) =>
          a.shiftId === shift.id &&
          a.date.toDateString() === today.toDateString()
      );

      let attendanceStatus = "ABSENT";
      if (attendance) {
        attendanceStatus = attendance.status;
      }

      const now = new Date();
      const start = new Date();
      start.setHours(shift.startTime.getHours(), shift.startTime.getMinutes());

      if (!attendance && now > start) attendanceStatus = "LATE";

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        attendanceStatus,
      };
    });

    return {
      id: shift.id,
      type: shift.type,
      startTime: shift.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: shift.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      users: usersWithStatus,
    };
  });

  const officeData = {
    id: office.id,
    name: office.name,
    location: office.location,
    shifts: shiftsWithAttendance,
  };

  return <OfficeShiftsCards office={officeData} />;
}
