import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";

export async function evaluateAttendance(userId: number, date: Date) {
  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_shiftId_date: {
        userId,
        shiftId: 1,
        date,
      },
    },
    include: { shift: true },
  });

  if (!attendance) return AttendanceStatus.ABSENT;

  const shiftStart = new Date(date) shiftStart.setHours(8, 0, 0, 0);
  const cutoffAbsent = new Date(date) cutoffAbsent.setHours(8, 30, 0, 0);

  if (attendance.reason && attendance.date <= cutoffAbsent) return AttendanceStatus.PERMISSION;
  if (!attendance.checkInAt && attendance.date > cutoffAbsent) return AttendanceStatus.ABSENT;
  if (attendance.checkInAt && attendance.checkInAt > shiftStart) return AttendanceStatus.LATE;
  if (attendance.checkOutAt && attendance.checkOutAt < attendance.shift.endTime) return AttendanceStatus.LATE;
  return AttendanceStatus.ON_TIME;
}

 
export const getStatusColor = (status: AttendanceStatus) => {
  switch (status) {
    case "ON_TIME": return "bg-green-100 text-green-600 border-green-300";
    case "LATE": return "bg-yellow-100 text-yellow-600 border-yellow-300";
    case "ABSENT": return "bg-red-100 text-red-600 border-red-300";
    case "PERMISSION": return "bg-blue-100 text-blue-600 border-blue-300";
    default: return "bg-gray-100 text-gray-600 border-gray-300";
  }
}
