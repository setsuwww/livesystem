import { prisma } from "@/lib/prisma";
import ScheduleForm from "./CreateForm";
import { getUserFromToken } from "@/app/api/schedules/route";

export default async function Page() {
  const user = await getUserFromToken();
  if (!user) {
    return <div>Unauthorized</div>;
  }

  const schedules = await prisma.schedule.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      shiftId: true,
      shift: {
        select: {
          type: true,
          startTime: true,
          endTime: true
        }
      }
    },
    orderBy: { date: "asc" }
  });

  return <ScheduleForm schedules={schedules} />;
}
