
import { NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"
import { revalidatePath } from "next/cache"

export async function PATCH(request, { params }) {
  try { const { id } = params 
    const body = await request.json()
    const { status: newStatus, reason: adminReason, type } = body

    if (type === "permission") {
      const permission = await prisma.permissionRequest.update({
        where: { id: Number(id) },
        data: {
          status: newStatus,
          adminReason: adminReason || null,
        },
        include: { user: true },
      })

      await prisma.attendance.updateMany({
        where: {
          userId: permission.userId,
          date: permission.date,
        },
        data: {
          status: newStatus === "ACCEPTED" ? "PERMISSION" : "ABSENT",
          reason:
            newStatus === "REJECTED"
              ? adminReason || "Permission request rejected"
              : undefined,
        },
      })

      revalidatePath("/admin/dashboard/request")
      return NextResponse.json({ success: true, data: permission })
    }

    if (type === "shift") {
      const shiftChange = await prisma.shiftChangeRequest.update({
        where: { id: Number(id) },
        data: {
          status: newStatus,
          adminReason: adminReason || null,
        },
        include: {
          requestedBy: true,
          targetUser: true,
          oldShift: true,
          targetShift: true,
        },
      })

      if (newStatus === "ACCEPTED") {
        await prisma.user.update({
          where: { id: shiftChange.targetUserId },
          data: { shiftId: shiftChange.targetShiftId },
        })
      }

      revalidatePath("/admin/dashboard/request")
      return NextResponse.json({ success: true, data: shiftChange })
    }

    return NextResponse.json(
      { success: false, message: "Invalid request type" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Update request status failed:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}