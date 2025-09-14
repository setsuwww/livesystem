export const toMinutes = (date) => date.getHours() * 60 + date.getMinutes();

<<<<<<< HEAD
=======

export function timeToInt(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
export function minutesToTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

export const isCrossDayShift = (shift) => shift.endMinutes <= shift.startMinutes

export function getAttendanceStatus({ checkIn, permissionReason, shift }) {
<<<<<<< HEAD
  if (permissionReason && permissionReason.trim().length > 0) { return "PERMISSION"}
  if (!checkIn) { return "ABSENT" }

  const checkInMinutes = checkIn.getHours() * 60 + checkIn.getMinutes()
  const lateThreshold = shift.startTime + 10

  if (checkInMinutes > lateThreshold) { return "LATE" }
  return "PRESENT"
=======
  if (permissionReason && permissionReason.trim().length > 0) { return "PERMISSION" }
  if (!checkIn) { return "ABSENT" }

  const checkInMinutes = checkIn.getHours() * 60 + checkIn.getMinutes();
  const lateThreshold = shift.startTime + 10;   // telat
  const absentThreshold = shift.startTime + 20; // dianggap absen

  if (checkInMinutes > absentThreshold) { return "ABSENT" } 
  else if (checkInMinutes > lateThreshold) { return "LATE" }
  return "PRESENT";
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
}

export function canCheckout(now, shift) { const nowMinutes = toMinutes(now);
  const checkoutOpenMinutes = shift.endMinutes - 10;

<<<<<<< HEAD
  if (isCrossDayShift(shift)) {
    if (nowMinutes >= checkoutOpenMinutes || nowMinutes < shift.endMinutes) return true;
  } 
  else {
    if (nowMinutes >= checkoutOpenMinutes) return true;
  }
=======
  if (isCrossDayShift(shift)) { if (nowMinutes >= checkoutOpenMinutes || nowMinutes < shift.endMinutes) return true } 
  else { if (nowMinutes >= checkoutOpenMinutes) return true }
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
  return false;
}
