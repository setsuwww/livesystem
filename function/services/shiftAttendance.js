export function toMinutes(date) { return date.getHours() * 60 + date.getMinutes() }

export function minutesToTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

export function isCrossDayShift(shift) { return shift.endMinutes <= shift.startMinutes }

export function getAttendanceStatus({ checkIn, permissionReason, shift }) {
  if (permissionReason && permissionReason.trim().length > 0) { return "PERMISSION"}
  if (!checkIn) { return "ABSENT" }

  const checkInMinutes = checkIn.getHours() * 60 + checkIn.getMinutes()
  const lateThreshold = shift.startTime + 10

  if (checkInMinutes > lateThreshold) { return "LATE" }
  return "PRESENT"
}

export function canCheckout(now, shift) { const nowMinutes = toMinutes(now);
  const checkoutOpenMinutes = shift.endMinutes - 10;

  if (isCrossDayShift(shift)) {
    if (nowMinutes >= checkoutOpenMinutes || nowMinutes < shift.endMinutes) return true;
  } 
  else {
    if (nowMinutes >= checkoutOpenMinutes) return true;
  }
  return false;
}

