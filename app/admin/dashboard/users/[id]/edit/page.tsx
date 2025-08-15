import UsersEditForm from "./EditForm";
import { prisma } from "@/lib/prisma";

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      shiftId: true,
    },
  });

  if (!user) { throw new Error("User not found");}

  const shifts = await prisma.shift.findMany({
    select: {
      id: true,
      type: true,
      startTime: true,
      endTime: true,
    },
  });

  return (
    <UsersEditForm userId={user.id} shifts={shifts}
      initialForm={{ name: user.name, email: user.email, password: "", role: user.role,
        shiftId: user.shiftId ? String(user.shiftId) : "NONE",
      }}
    />
  );
}
