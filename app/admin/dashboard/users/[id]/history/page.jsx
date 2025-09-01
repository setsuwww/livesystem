import { prisma } from "@/lib/prisma"

import { ContentInformation } from "@/components/content/ContentInformation"
import ContentForm from "@/components/content/ContentForm"
import UserHistoryTable from "./HistoryTable"
import { DashboardHeader } from "../../../DashboardHeader"
import { Pagination } from "../../../Pagination"

const PAGE_SIZE = 10

async function getHistory(userId, page = 1) {
  return await prisma.attendance.findMany({ where: { userId },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { shift: true,
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { date: "desc" },
  })
}

async function getHistoryCount(userId) {
  return await prisma.attendance.count({ where: { userId } })
}

export const revalidate = 60

export default async function UserHistoryPage({ params, searchParams }) {
  const { id } = await params
  const page = Number(searchParams?.page) || 1

  const [history, total] = await Promise.all([
    getHistory(Number(id), page),
    getHistoryCount(Number(id)),
  ])

  const serializedHistory = history.map((h) => ({
    ...h,
    date: h.date.toISOString(),
    checkInTime: h.checkInTime ? h.checkInTime.toISOString() : null,
    checkOutTime: h.checkOutTime ? h.checkOutTime.toISOString() : null,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
    shift: h.shift
      ? {
          ...h.shift,
          startTime: h.shift.startTime.toISOString(),
          endTime: h.shift.endTime.toISOString(),
        }
      : null,
  }))

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const user = history.length > 0 ? history[0].user : null

  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>
  }

  return (
    <section>
      <DashboardHeader title={`Attendance History`} subtitle={user ? `${user.name} (${user.email})` : "User"}/>

      <ContentForm>
        <ContentForm.Header>
          <ContentInformation
            heading="Attendance Records"
            subheading="Detail check-in & check-out"
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <UserHistoryTable history={serializedHistory} />
        </ContentForm.Body>

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath={`/admin/dashboard/users/${id}/history`}
        />
      </ContentForm>
    </section>
  )
}
