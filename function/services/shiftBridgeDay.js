export function shiftBridgeDay(checkIn, shiftStart, shiftEnd) {
  if (shiftEnd < shiftStart) {
    return checkIn >= shiftStart || checkIn <= shiftEnd;
  }
  return checkIn >= shiftStart && checkIn <= shiftEnd;
}
