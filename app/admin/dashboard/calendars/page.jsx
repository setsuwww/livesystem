import { prisma } from "@/lib/prisma";
import CalendarPageview from "./CalendarPageview";

async function getSchedules() {
  return await prisma.schedule.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

function formatDate(date) {
  if (!date) return "";
  let d;
  try { d = typeof date === "string" ? new Date(date) : date;
  } 
  catch {
    return "";
  }

  if (isNaN(d.getTime())) 
    return "";
  return d.toISOString().split("T")[0];
}


export default async function Page() {
  const schedules = await getSchedules();

  const initialEvents = schedules.map(s => ({
    id: s.id.toString(),
    title: s.title,
    description: s.description,
    date: formatDate(s.date),
    backgroundColor: "#0070f3",
    borderColor: "#0070f3",
    textColor: "#ffffff"
  }));


  return <CalendarPageview initialEvents={initialEvents} />;
}
