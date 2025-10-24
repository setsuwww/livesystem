export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const revalidate = 20

import { prisma } from "@/_lib/prisma"
import RequestsTabs from "./RequestsTabs"
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader"
import ContentForm from "@/_components/content/ContentForm"
import { ContentInformation } from "@/_components/content/ContentInformation"

async function getRequests() {
  const [shiftRequests, attendanceRequests] = await Promise.all([
    prisma.shiftChangeRequest.findMany({
      where: { status: "PENDING_ADMIN"},
      orderBy: { createdAt: "desc" },
      include: {
        requestedBy: true,
        targetUser: true,
        oldShift: true,
        targetShift: true,
      },
    }),

    prisma.attendance.findMany({
      where: {
        status: "PERMISSION",
        approval: "PENDING",
      },
      orderBy: { date: "desc" },
      include: {
        user: true,
        shift: true,
      },
    }),
  ])

  return {
    shift: shiftRequests.map((r) => ({
      id: `shift-${r.id}`,
      type: "Shift Change",
      requestedBy: {
        name: r.requestedBy?.name || "-",
        email: r.requestedBy?.email || "-",
      },
      user: {
        name: r.targetUser?.name || "-",
        email: r.targetUser?.email || "-",
      },
      oldShift: {
        name: r.oldShift?.name || "-",
        type: r.oldShift?.type || "-",
      },
      targetShift: {
        name: r.targetShift?.name || "-",
        type: r.targetShift?.type || "-",
      },
      info: `${r.oldShift?.name || "?"} (${r.oldShift?.type || "-"}) → ${r.targetShift?.name || "?"} (${r.targetShift?.type || "-"})`,
      reason: r.reason || "-",
      date: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-",
      status: r.status || "PENDING",
    })),

    attendance: attendanceRequests.map((r) => ({
      id: `perm-${r.id}`,
      type: "Permission",
      requestedBy: {
        name: r.user?.name || "-",
        email: r.user?.email || "-",
      },
      user: null,
      reason: r.reason || "-",
      info: r.shift?.name || "-",
      typeShift: r.shift?.type || "-",
      date: r.date
        ? new Date(r.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long",
          })
        : "-",
      status: r.approval || "PENDING",
    })),
  }
}

export default async function Page() {
  const { shift, attendance } = await getRequests()

  return (
    <section>
      <DashboardHeader
        title="Requests"
        subtitle="Manage pending requests by type"
      />

      <ContentForm>
        <ContentForm.Header>
          <ContentInformation
            heading="Pending Requests"
            subheading="Switch between Shift Change and Permission requests"
            show={false}
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <RequestsTabs shiftRequests={shift} permissionRequests={attendance} />
        </ContentForm.Body>
      </ContentForm>
    </section>
  )
}


