// app/employee/dashboard/attendance/change-shift/page.jsx
import { prisma } from "@/lib/prisma"
import ChangeShiftForm from "./ChangeShiftForm"

export const revalidate = 30 // ISR setiap 30 detik (optional)

export default async function Page() {
  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    include: { shift: true },
    orderBy: { name: "asc" },
  })

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Change Shift Request
      </h1>
      <ChangeShiftForm employees={employees} />
    </main>
  )
}
