import { prisma } from "@/lib/prisma";
import CreateForm from "./CreateForm";

export default async function Page() {
  const [shifts, offices] = await Promise.all([
    prisma.shift.findMany({
      select: { id: true, type: true, startTime: true, endTime: true },
    }),
    prisma.office.findMany({
      select: { id: true, name: true, startTime: true, endTime: true,
        shifts: {
          select: {
            id: true,
            name: true, 
            startTime: true,
            endTime: true,
          }
        }
      },
    }),
  ]);

  return <CreateForm shifts={shifts} offices={offices} />;
}
