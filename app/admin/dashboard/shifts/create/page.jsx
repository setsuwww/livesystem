import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import CreateForm from "./CreateForm";

export const revalidate = 60;

export default async function CreateShiftPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <section>
      <DashboardHeader title="Shifts" subtitle="Manage shifts data" />
      <CreateForm users={users} />
    </section>
  );
}
