export function shiftBridgeDay(now, shiftStart, shiftEnd) {
  const current = new Date(now);

  // helper: parse string ("HH:MM") atau Date → Date object (hari ini)
  function parseTime(time, base) {
    const ref = new Date(base); // clone biar tetep hari yg sama
    let hours, minutes;

    if (typeof time === "string") {
      [hours, minutes] = time.split(":");
      ref.setHours(Number(hours), Number(minutes), 0, 0);
    } else if (time instanceof Date) {
      ref.setHours(time.getHours(), time.getMinutes(), 0, 0);
    } else {
      throw new Error("Invalid time format");
    }

    return ref;
  }

  const start = parseTime(shiftStart, current);
  let end = parseTime(shiftEnd, current);

  // kalau end lebih kecil/sama dengan start → shift nyebrang hari
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  // toleransi shift malam: mulai 3 jam lebih awal kalau shift start < 03:00
  const adjustedStart = new Date(start);
  if (start.getHours() < 3) {
    adjustedStart.setHours(adjustedStart.getHours() - 3);
  }

  return current >= adjustedStart && current <= end;
}
