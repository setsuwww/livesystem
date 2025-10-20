// app/admin/dashboard/shifts/create/page.jsx
import CreateForm from "./CreateForm";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function CreateShiftPage() {
  const offices = await prisma.office.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return <CreateForm offices={offices} />;
}
