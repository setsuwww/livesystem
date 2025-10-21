// app/employee/dashboard/attendance/change-shift/page.jsx
import { prisma } from "@/_lib/prisma"
import ChangeShiftForm from "./ChangeShiftForm"
import ChangeShiftTable from "./ChangeShiftTable"
import { getCurrentUser } from "@/_lib/auth" // pastikan path benar
import { ContentInformation } from '@/_components/content/ContentInformation';

export const revalidate = 30

export default async function Page() {
  const user = await getCurrentUser()

  if (!user) {
    return <p className="text-center text-rose-500">Unauthorized</p>
  }

  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    include: { shift: true },
    orderBy: { name: "asc" },
  })

  const requests = await prisma.shiftChangeRequest.findMany({
    where: {
      targetUserId: user.id, // hanya request ke dia
    },
    include: {
      user: true, // pengirim
      oldShift: true,
      newShift: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="mx-auto p-6 space-y-6">
      <div className="mb-6">
      <ContentInformation heading="Change Shift" subheading="Send a change a shift request, accept or reject" />
</div>
      <ChangeShiftForm employees={employees} />
      <ChangeShiftTable
  requests={JSON.parse(JSON.stringify(requests))}
  currentUserId={user.id}
/>

    </main>
  )
}
