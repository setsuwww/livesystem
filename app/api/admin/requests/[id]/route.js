import { NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"
import { revalidatePath } from "next/cache"

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status: newStatus, reason: adminReason, type } = body

    // 🌀 HANDLE PERMISSION (ATTENDANCE)
    if (type === "permission" || type === "attendance") {
      const record = await prisma.attendance.update({
        where: { id: Number(id) },
        data: {
          approval: newStatus, // 🔥 pakai approval, bukan status
          adminReason: adminReason || null,
        },
        include: {
          user: true,
          shift: true,
        },
      })

      revalidatePath("/admin/dashboard/request")
      return NextResponse.json({ success: true, data: record })
    }

    // 🌀 HANDLE SHIFT CHANGE REQUEST
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

      // 🔄 Update shift user hanya kalau diterima
      if (newStatus === "ACCEPTED" && shiftChange.targetUserId && shiftChange.targetShiftId) {
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
    console.error("❌ Update request status failed:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
