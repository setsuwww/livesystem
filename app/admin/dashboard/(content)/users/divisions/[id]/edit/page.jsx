import { notFound } from "next/navigation";
import { prisma } from "@/_lib/prisma";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import ContentForm from "@/_components/content/ContentForm";
import { ContentInformation } from "@/_components/content/ContentInformation";
import EditDivisionForm from "./EditDivisionForm";

export const revalidate = 60;

async function getDivision(id) {
  const division = await prisma.division.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      location: true,
      longitude: true,
      latitude: true,
      radius: true,
      type: true,
      status: true,
      startTime: true,
      endTime: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!division) return null;
  return division;
}

export default async function Page({ params }) {
  const { id } = params;
  const division = await getDivision(id);

  if (!division) return notFound();

  return (
    <section>
      <DashboardHeader
        title={`Edit Division`}
        subtitle="Update division details and configuration"
      />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation
            heading="Edit Division"
            subheading={`Editing data for: ${division.name}`}
            show
            variant="outline"
            buttonText="Back"
            href="/admin/dashboard/divisions"
          />
        </ContentForm.Header>

        {/* CSR form */}
        <EditDivisionForm division={division} />
      </ContentForm>
    </section>
  );
}
