import { AttendanceStatus, ShiftType } from "@prisma/client";

export function evaluateAttendance(att: {
  shiftType: ShiftType;
  date: Date;
  checkInAt?: Date | null;
  checkOutAt?: Date | null;
  reason?: string | null;
  approved?: boolean | null;
}) {
  if (att.shiftType === "OFF") return AttendanceStatus.ON_TIME;
  
  const start = new Date(att.date); start.setHours(8, 0, 0, 0);
  const cutoff = new Date(att.date); cutoff.setHours(8, 30, 0, 0);

  // permission
  if (!att.checkInAt && att.reason && att.approved && new Date() <= cutoff) return AttendanceStatus.PERMISSION;
  // absent
  if (!att.checkInAt && new Date() > cutoff) return AttendanceStatus.ABSENT;
  // late
  if (att.checkInAt && att.checkInAt > start) return AttendanceStatus.LATE;
  
  return AttendanceStatus.ON_TIME;
}
