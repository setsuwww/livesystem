import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";
import ContentForm from '@/components/content/ContentForm';
import { ContentInformation } from '@/components/content/ContentInformation';
import { DashboardHeader } from "../../../DashboardHeader";
  
export const revalidate = 60;

export default async function Page({
  params
}) {
  const shift = await prisma.shift.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!shift) return <div>Shift not found</div>;

  const safeShift = {
    ...shift,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime.toISOString(),
  };

  return (
    <section className="space-y-6">
        <DashboardHeader title="Edit Shift" subtitle="Update shift type and time range" />
    
        <ContentForm>
          <ContentForm.Header>
            <ContentInformation heading="Shift Information" subheading="Update shift type and time range" />
          </ContentForm.Header>
          
          <ContentForm.Body>
            <EditForm shift={safeShift} />
          </ContentForm.Body>
        </ContentForm>
    </section>
  );
}

