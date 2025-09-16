import { prisma } from "@/lib/prisma";
import ScheduleForm from "./CreateForm";
import { getUserFromToken } from "@/lib/auth";

export default async function Page() {
  const user = await getUserFromToken();
  if (!user) return <div>Unauthorized</div>;

  const schedules = await prisma.schedule.findMany({
    where: { userId: user.id },
    select: {
      id: true, title: true, description: true,
      startDate: true, endDate: true,
      createdAt: true, updatedAt: true,
      userId: true, shiftId: true,
      shift: {
        select: {
          id: true,
          type: true, shiftName: true,
          startTime: true, endTime: true,
        },
      },
    },
    orderBy: { startDate: "asc" },
  });

  const shifts = await prisma.shift.findMany({
    select: {
      id: true,
      type: true, shiftName: true,
      startTime: true, endTime: true,
    },
    orderBy: { id: "asc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });

  return <ScheduleForm users={users} schedules={schedules} shifts={shifts} />;
}

// 