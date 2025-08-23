export const capitalize = (str) => str.charAt(0) + str.slice(1).toLowerCase() 

export function toDateFromTimeString(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}