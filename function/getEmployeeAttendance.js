function getAttendanceStatus(userClockIn, shift) {
  const startHour = shift.startTime.getHours();
  const startMinute = shift.startTime.getMinutes();
  const shiftStart = new Date(userClockIn);
  shiftStart.setHours(startHour, startMinute, 0, 0);

  if (!userClockIn) return "ABSENT";

  if (userClockIn > shiftStart) return "LATE";
  return "PRESENT";
}
