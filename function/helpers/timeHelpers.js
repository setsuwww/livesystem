import dayjs from "dayjs";

export const capitalize = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function parseTimeToDate(timeString) {
 return dayjs(timeString).toDate();
}


export function normalizeTimeString(time) {
  if (!time) return "";

  if (typeof time === "string" && time.includes(":")) {
    const [h, m] = time.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  }

  if (time instanceof Date) {
    const h = time.getHours().toString().padStart(2, "0");
    const m = time.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  if (typeof time === "object" && time !== null) {
    const date = new Date(time);
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  return "";
}

// Format input (Date atau string) => "HH:mm"
export function formatTimeString(input) {
  return normalizeTimeString(input);
}

// Format Date => "HH:mm"
export function formatDateToTime(dateObj) {
  if (!(dateObj instanceof Date)) return "";
  return dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatTimeRange(start, end) {
  return `${dayjs(start).format("HH:mm")} - ${dayjs(end).format("HH:mm")}`;
}

export function isLate(checkinDate, shiftStartStr) {
  const shiftStart = parseTimeToDate(shiftStartStr);
  return checkinDate > shiftStart;
}

export async function getCurrentShift(prisma) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const shifts = await prisma.shift.findMany();

  for (const shift of shifts) {
    const [sh, sm] = shift.startTime.split(":").map(Number);
    const [eh, em] = shift.endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    if (start < end) {
      if (currentMinutes >= start && currentMinutes < end) return shift;
    } else {
      if (currentMinutes >= start || currentMinutes < end) return shift;
    }
  }

  return null;
}
