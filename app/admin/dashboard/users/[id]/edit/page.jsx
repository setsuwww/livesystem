import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

export default async function Page({ params }) {
  const userId = parseInt(params.id);

  const [user, shifts, offices] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        officeId: true,
        shiftId: true,
      },
    }),
    prisma.shift.findMany({
      select: { id: true, name: true, startTime: true, endTime: true },
    }),
    prisma.office.findMany({
      select: {
        id: true,
        name: true,
        startTime: true,
        endTime: true,
        shifts: {
          select: { id: true, name: true, startTime: true, endTime: true },
        },
      },
    }),
  ]);

  return <EditForm user={user} shifts={shifts} offices={offices} />;
}
