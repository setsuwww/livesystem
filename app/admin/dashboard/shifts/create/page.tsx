import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
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
      <ContentForm>
        <ContentInformation heading="Create Shift" subheading="Create a new shift for your team."/>
        <CreateForm users={users} />
      </ContentForm>
    </section>
  );
}
