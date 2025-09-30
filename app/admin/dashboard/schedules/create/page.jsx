import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import ScheduleForm from "./CreateForm";

export default async function Page() {
  const user = await getUserFromToken();
  if (!user) return <div>Unauthorized</div>;

  const schedules = await prisma.schedule.findMany({
    where: {
      users: {
        some: { userId: user.id },
      },
    },
    include: {
      shift: true,
      users: { include: { user: true } },
    },
    orderBy: { startDate: "asc" },
  });

  const shifts = await prisma.shift.findMany({
    select: { id: true, type: true, shiftName: true, startTime: true, endTime: true },
    orderBy: { id: "asc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });

  return (
    <ScheduleForm users={users} schedules={schedules} shifts={shifts} />
  );
}
