import { prisma } from "@/lib/prisma"
<<<<<<< HEAD

import { ContentInformation } from "@/components/content/ContentInformation"
=======
import { CircleUserRound } from "lucide-react"

import { ContentInformation } from "@/components/content/ContentInformation"
import { ContentList } from "@/components/content/ContentList"
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
import ContentForm from "@/components/content/ContentForm"
import UserHistoryTable from "./HistoryTable"
import { DashboardHeader } from "../../../DashboardHeader"
import { Pagination } from "../../../Pagination"
<<<<<<< HEAD
=======
import { minutesToTime } from '@/function/services/shiftAttendance';
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf

const PAGE_SIZE = 10

async function getHistory(userId, page = 1) {
<<<<<<< HEAD
  return await prisma.attendance.findMany({ where: { userId },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { shift: true,
      user: {
        select: { name: true, email: true },
=======
  return await prisma.attendance.findMany({
    where: { userId },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      shift: true,
      user: {
        select: { id: true, name: true, email: true },
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
      },
    },
    orderBy: { date: "desc" },
  })
}

<<<<<<< HEAD
=======
async function getUserProfile(userId) {
  return await prisma.user.findUnique({ where: { id: userId },
    select: { id: true, name: true, email: true },
  })
}

>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
async function getHistoryCount(userId) {
  return await prisma.attendance.count({ where: { userId } })
}

export const revalidate = 60

export default async function UserHistoryPage({ params, searchParams }) {
  const { id } = await params
  const page = Number(searchParams?.page) || 1

<<<<<<< HEAD
  const [history, total] = await Promise.all([
    getHistory(Number(id), page),
    getHistoryCount(Number(id)),
=======
  const [history, total, profile] = await Promise.all([
    getHistory(Number(id), page),
    getHistoryCount(Number(id)),
    getUserProfile(Number(id)),
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
  ])

  const serializedHistory = history.map((h) => ({
    ...h,
    date: h.date.toISOString(),
<<<<<<< HEAD
    checkInTime: h.checkInTime ? h.checkInTime.toISOString() : null, checkOutTime: h.checkOutTime ? h.checkOutTime.toISOString() : null,
    createdAt: h.createdAt.toISOString(), updatedAt: h.updatedAt.toISOString(),
    shift: h.shift
      ? {
          ...h.shift,
          startTime: h.shift.startTime.toISOString(),
          endTime: h.shift.endTime.toISOString(),
=======
    checkInTime: h.checkInTime ? h.checkInTime.toISOString() : null,
    checkOutTime: h.checkOutTime ? h.checkOutTime.toISOString() : null,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
    shift: h.shift
      ? {
          ...h.shift,
          startTime: minutesToTime(h.shift.startTime),
          endTime: minutesToTime(h.shift.endTime),
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
        }
      : null,
  }))

  const totalPages = Math.ceil(total / PAGE_SIZE)
<<<<<<< HEAD
  const user = history.length > 0 ? history[0].user : null
=======
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf

  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>
  }

  return (
    <section>
<<<<<<< HEAD
      <DashboardHeader title={`Attendance History`} subtitle={user ? `${user.name} (${user.email})` : "User"}/>
=======
      <DashboardHeader
        title={`Attendance History`}
        subtitle={profile ? `${profile.name} (${profile.email})` : "User"}
      />
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf

      <ContentForm>
        <ContentForm.Header>
          <ContentInformation
            heading="Attendance Records"
            subheading="Detail check-in & check-out"
          />
<<<<<<< HEAD
=======
          <div className='mb-6'>
            {profile && (
              <div className="mb-2 p-3 flex items-center space-x-2 rounded-xl bg-gray-50 border border-zinc-200 shadow-xs">
                <div className="p-2 bg-gray-200 text-gray-600 rounded-lg">
                  <CircleUserRound strokeWidth={1.5} size={30} />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-md font-semibold text-zinc-600">{profile.name}</h2>
                  <p className="text-sm text-gray-400">{profile.email}</p>
                </div>
              </div>
            )}
            <ContentList type="w" items={[
              "This page only see users history and clear the history, manage all data shift and attendances on their on page"
            ]}/>
          </div>
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
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
