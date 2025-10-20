import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import EditForm from "./EditForm"

export default async function Page({ params }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return <div>Unauthorized</div>

  const schedule = await prisma.schedule.findFirst({
    where: { id: Number(id), users: { some: { userId: user.id } } },
    include: { users: { include: { user: true } } },
  })

  if (!schedule) return notFound()

  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true, email: true },
    orderBy: { id: "asc" },
  })

  const shifts = await prisma.shift.findMany({ select: { id: true, name: true } })

  return (
    <EditForm
      schedule={{
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        frequency: schedule.frequency,
        startDate: schedule.startDate ? schedule.startDate.toISOString().split("T")[0] : "",
        endDate: schedule.endDate ? schedule.endDate.toISOString().split("T")[0] : "",
        startTime: schedule.startTime ?? "",
        endTime: schedule.endTime ?? "",
        users: schedule.users.map((u) => u.user),
      }}
      users={users}
      shifts={shifts}
    />
  )
}
