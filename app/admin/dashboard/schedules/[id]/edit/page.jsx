import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";
import { getUserFromToken } from "@/lib/auth";

export default async function Page({
  params
}) {
  const user = await getUserFromToken();

  if (!user) return <div>Unauthorized</div>

  const schedule = await prisma.schedule.findUnique({
    where: {
      id: Number(params.id),
      userId: user.id,
    },
    include: {
      shift: {
        select: {
          id: true,
          type: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  if (!schedule) return notFound();

  const shifts = await prisma.shift.findMany({
    select: {
      id: true,
      type: true,
      startTime: true,
      endTime: true,
    },
    orderBy: { id: "asc" },
  });

  return <EditForm schedule={schedule} shifts={shifts} />;
}
