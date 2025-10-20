export const toMinutes = (date) => date.getHours() * 60 + date.getMinutes();


export function timeToInt(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

export const isCrossDayShift = (shift) => shift.endMinutes <= shift.startMinutes

export function getAttendanceStatus({ checkIn, permissionReason, shift }) {
  if (permissionReason && permissionReason.trim().length > 0) { return "PERMISSION" }
  if (!checkIn) { return "ABSENT" }

  const checkInMinutes = checkIn.getHours() * 60 + checkIn.getMinutes();
  const lateThreshold = shift.startTime + 10;
  const absentThreshold = shift.startTime + 20;

  if (checkInMinutes > absentThreshold) { return "ABSENT" } 
  else if (checkInMinutes > lateThreshold) { return "LATE" }
  return "PRESENT";
}

export function canCheckout(now, shift) { const nowMinutes = toMinutes(now);
  const checkoutOpenMinutes = shift.endMinutes - 10;

  if (isCrossDayShift(shift)) { if (nowMinutes >= checkoutOpenMinutes || nowMinutes < shift.endMinutes) return true } 
  else { if (nowMinutes >= checkoutOpenMinutes) return true }
  return false;
}
