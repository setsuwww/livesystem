import { prisma } from "@/lib/prisma";
import CalendarPageview from "./CalendarPageview";

async function getSchedules() {
  return await prisma.schedule.findMany({
    select: {
      id: true,
      title: true,
      date: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export default async function Page() {
  const schedules = await getSchedules();

  const initialEvents = schedules.map(s => ({
    id: s.id.toString(),
    title: s.title,
    date: s.date.toISOString().split("T")[0],
    backgroundColor: "#0070f3",
    borderColor: "#0070f3",
    textColor: "#ffffff"
  }));

  return <CalendarPageview initialEvents={initialEvents} />;
}
