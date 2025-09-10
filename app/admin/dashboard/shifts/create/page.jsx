import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "../../DashboardHeader";
import CreateForm from "./CreateForm";

export const revalidate = 60;

export default async function CreateShiftPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true, }, 
    where: { role: "EMPLOYEE" },
    orderBy: { name: "asc" },
  });

  return (
    <section>
      <DashboardHeader title="Shifts" subtitle="Manage shifts data" />
      <CreateForm users={users} />
    </section>
  );
}
