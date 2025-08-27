import { isAfter, addMinutes } from "date-fns";
import { shiftBridgeDay } from "./shiftBridgeDay";

export function shiftAttendancesController( shiftStart, shiftEnd, checkInTime, hasPermission ) {
  if (hasPermission) return "PERMISSION";
  if (!checkInTime) return "ALPHA";

  let realShiftEnd = new Date(shiftEnd);
  if (realShiftEnd <= shiftStart) {
    realShiftEnd.setDate(realShiftEnd.getDate() + 1);
  }

  if (!shiftBridgeDay(checkInTime, shiftStart, shiftEnd)) {
    return "ALPHA";
  }

  const lateThreshold = addMinutes(shiftStart, 10);
  const absentThreshold = addMinutes(shiftStart, 20);

  if (isAfter(checkInTime, realShiftEnd)) return "ALPHA";
  if (isAfter(checkInTime, absentThreshold)) return "ABSENT";
  if (isAfter(checkInTime, lateThreshold)) return "LATE";

  return "PRESENT";
}
