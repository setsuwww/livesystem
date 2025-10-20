import { getCurrentUser } from "@/_lib/auth"
import { prisma } from "@/_lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { targetUserId, startDate, endDate, reason } = await req.json()

    // pastikan target user valid
    const targetUser = await prisma.user.findUnique({ where: { id: Number(targetUserId) } })
    if (!targetUser) {
      return NextResponse.json({ message: "Target user not found" }, { status: 400 })
    }

    const oldShiftId = user.shiftId
    const targetShiftId = targetUser.shiftId

    // buat request
    const changeRequest = await prisma.shiftChangeRequest.create({
      data: {
        userId: user.id,           // user yang minta tukar shift
        requestedById: user.id,    // sama karena dia sendiri yang ajukan
        targetUserId: targetUser.id,
        oldShiftId,                // shift sekarang si user
        targetShiftId,             // shift milik target user
        reason,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        user: true,
        targetUser: true,
        oldShift: true,
        targetShift: true,
      },
    })

    return NextResponse.json({ success: true, changeRequest })
  } catch (err) {
    console.error("POST /api/shifts/user-side-change error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
