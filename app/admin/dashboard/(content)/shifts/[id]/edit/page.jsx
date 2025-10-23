import EditForm from "./EditForm";
import { prisma } from "@/_lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function EditShiftPage({ params }) {
  const shiftId = parseInt(params.id);

  const [shift, offices] = await Promise.all([
    prisma.shift.findUnique({
      where: { id: shiftId },
      select: {
        id: true,
        name: true,
        type: true,
        startTime: true,
        endTime: true,
        officeId: true,
      },
    }),
    prisma.office.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!shift) return notFound();

  return <EditForm shift={shift} offices={offices} />;
}
