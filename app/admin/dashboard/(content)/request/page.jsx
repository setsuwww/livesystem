export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const revalidate = 0

import { prisma } from "@/_lib/prisma"
import RequestsTabs from "./RequestsTabs"
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader"
import ContentForm from "@/_components/content/ContentForm"
import { ContentInformation } from "@/_components/content/ContentInformation"

export default async function Page() {
  const { shift, permission } = await getRequests()

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
            subheading="Switch betweex  n Shift Change and Permission requests"
            show={false}
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <RequestsTabs
            shiftRequests={shift}
            permissionRequests={permission}
          />
        </ContentForm.Body>
      </ContentForm>
    </section>
  )
}

async function getRequests() {
  const [shiftRequests, permissionRequests] = await Promise.all([
    prisma.shiftChangeRequest.findMany({
      where: { status: "PENDING_TARGET" },
      orderBy: { createdAt: "desc" },
      include: {
        requestedBy: true,
        targetUser: true,
        oldShift: true,
        targetShift: true,
      },
    }),
    prisma.permissionRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: { user: true, shift: true },
    }),
  ])

  return {
    shift: shiftRequests.map((r) => ({
      id: `shift-${r.id}`,
      type: "Shift Change",
      requestedBy: r.requestedBy
        ? `${r.requestedBy.name || "-"} (${r.requestedBy.email || "-"})`
        : "-",
      user: r.targetUser
        ? `${r.targetUser.name || "-"} (${r.targetUser.email || "-"})`
        : "-",
      reason: r.reason || "-",
      info: `${r.oldShift?.name || "?"} → ${r.targetShift?.name || "?"}`,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-",
      status: r.status || "PENDING",
    })),
    permission: permissionRequests.map((r) => ({
      id: `perm-${r.id}`,
      type: "Permission",
      requestedBy: r.user
        ? `${r.user.name || "-"} (${r.user.email || "-"})`
        : "-",
      user: "-",
      reason: r.reason || "-",
      info: r.shift?.name || "-",
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-",
      status: r.status || "PENDING",
    })),
  }
}