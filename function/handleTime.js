export const capitalize = (str) => str.charAt(0) + str.slice(1).toLowerCase() 


async function getCurrentShift() { const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const shifts = await prisma.shift.findMany();

  for (const shift of shifts) {
    const start = shift.startTime.getUTCHours() * 60 + shift.startTime.getUTCMinutes();
    const end = shift.endTime.getUTCHours() * 60 + shift.endTime.getUTCMinutes();

    if (start < end) {
      if (currentMinutes >= start && currentMinutes < end) return shift;
    } 
    else {
      if (currentMinutes >= start || currentMinutes < end) return shift;
    }
  }

  return null; 
}


export function toDateFromTimeString(time) {
  if (!time) return null;

  if (time instanceof Date) {
    return time;
  }

  if (typeof time === "string") {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  }

  throw new error("Invalid time error" + time);
}

const formatTime = (dateTime) => {
  return new Date(dateTime).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: "UTC",
  });
};

export function formatTimeRange(start, end) {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

