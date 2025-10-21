import { NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"
import { getCurrentUser } from "@/_lib/auth"

export async function POST(req) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reason } = await req.json()
    if (!reason || reason.trim() === "") {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 })
    }

    const today = new Date()
    const todayDate = new Date(today.toDateString())

    if (!user.shiftId) {
      return NextResponse.json({ error: "No shift assigned" }, { status: 400 })
    }

    // ✅ Buat atau update PermissionRequest (biar gak dobel)
    const permission = await prisma.permissionRequest.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: todayDate,
        },
      },
      update: {
        reason,
        status: "PENDING",
      },
      create: {
        userId: user.id,
        shiftId: user.shiftId,
        date: todayDate,
        reason,
        status: "PENDING",
      },
    })

    // ✅ Update Attendance status ke PENDING (belum disetujui)
    const attendance = await prisma.attendance.upsert({
      where: {
        userId_shiftId_date: {
          userId: user.id,
          shiftId: user.shiftId,
          date: todayDate,
        },
      },
      update: { status: "PENDING", reason },
      create: {
        userId: user.id,
        shiftId: user.shiftId,
        date: todayDate,
        status: "PENDING",
        reason,
      },
    })

    return NextResponse.json({ success: true, permission, attendance })
  } catch (err) {
    console.error("permission API error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
