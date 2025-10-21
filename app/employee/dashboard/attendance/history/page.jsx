import { prisma } from "@/_lib/prisma"
import { notFound } from "next/navigation"
import { getCurrentUser } from "@/_lib/auth"
import HistoryTable from "./HistoryTable"
import { ContentInformation } from "@/_components/content/ContentInformation"

export const revalidate = 60

async function getAttendance(userId) {
  return prisma.attendance.findMany({
    where: { userId },
    select: {
      id: true,
      date: true,
      status: true,
      reason: true,
      shift: { select: { name: true } },
      createdAt: true,
    },
  })
}

async function getPermissionRequests(userId) {
  return prisma.permissionRequest.findMany({
    where: { userId },
    select: {
      id: true,
      date: true,
      status: true,
      reason: true,
      adminReason: true,
      shift: { select: { name: true } },
      createdAt: true,
    },
  })
}

export default async function Page({ searchParams }) {
  const user = await getCurrentUser()
  if (!user) return notFound()

  const order = searchParams?.order === "asc" ? "asc" : "desc"

  // Ambil data Attendance & PermissionRequest
  const [attendance, permissions] = await Promise.all([
    getAttendance(user.id),
    getPermissionRequests(user.id),
  ])

  // Format kedua data agar seragam
  const attendanceData = attendance.map((a) => ({
    id: `attendance-${a.id}`,
    date: a.date,
    status: a.status,
    reason: a.reason || "—",
    adminReason: "-",
    shift: a.shift?.name || "-",
    createdAt: a.createdAt,
  }))

  const permissionData = permissions.map((p) => ({
    id: `permission-${p.id}`,
    date: p.date,
    status: p.status,
    reason: p.reason || "—",
    adminReason: p.adminReason || "-",
    shift: p.shift?.name || "-",
    createdAt: p.createdAt,
  }))

  // Gabungkan dan urutkan berdasarkan tanggal
  const mergedData = [...attendanceData, ...permissionData].sort((a, b) => {
    return order === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
  })

  // Format untuk tampilan tabel
  const tableData = mergedData.map((r) => ({
    id: r.id,
    date: new Date(r.date).toLocaleDateString("en-User", {
      weekday: "long",
    }),
    datePart: new Date(r.date).toLocaleDateString("en-UD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    shift: r.shift,
    status: r.status,
    reason: r.reason,
    adminNote: r.adminReason,
    createdAt: r.createdAt.toISOString(),
  }))

  return (
    <section className="mt-10 space-y-4">
      <ContentInformation
        heading="Your Attendance & Permission History"
        subheading="Review all your attendance and permission records below"
      />  

      <HistoryTable data={tableData} initialOrder={order} />
    </section>
  )
}
