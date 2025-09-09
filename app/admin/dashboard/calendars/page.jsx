import { prisma } from "@/lib/prisma";
import CalendarPageview from "./CalendarPageview";

async function getSchedules() {
  return await prisma.schedule.findMany({
    include: {
      shift: {
        select: {
          id: true,
          type: true,
          startTime: true,
          endTime: true,
          attendances: {
            select: {
              id: true,
              status: true,
              user: { select: { id: true, name: true } }
            }
          }
        }
      },
      user: { select: { id: true, name: true } }
    }
  });
}

function formatDate(date) {
  if (!date) return "";
  let d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

export default async function Page() {
  const schedules = await getSchedules();

  const initialEvents = schedules.map(s => ({
    id: s.id.toString(),
    title: s.title,
    description: s.description,
    date: formatDate(s.date),
    shift: s.shift, // << penting buat dialog
    user: s.user,
  }));

  return <CalendarPageview initialEvents={initialEvents} />;
}
