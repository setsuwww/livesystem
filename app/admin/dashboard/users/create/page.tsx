import { prisma } from "@/lib/prisma";
import CreateForm from "./CreateForm";

export default async function Page() {
  const shifts = await prisma.shift.findMany({
    select: {
      id: true,
      type: true,
      startTime: true,
      endTime: true
    }
  });

  return <CreateForm shifts={shifts} />;
}
