import { prisma } from "@/lib/prisma";
import UsersForm from "./CreateForm";

export default async function Page() {
  const shifts = await prisma.shift.findMany({
    select: {
      id: true,
      type: true,
      startTime: true,
      endTime: true
    }
  });

  return <UsersForm shifts={shifts} />;
}
