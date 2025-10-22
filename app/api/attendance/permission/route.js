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

    if (!user.shiftId) {
      return NextResponse.json({ error: "No shift assigned" }, { status: 400 })
    }

    const today = new Date()
    const todayDate = new Date(today.toDateString())

    // ✅ Upsert langsung ke tabel Attendance
    const attendance = await prisma.attendance.upsert({
      where: {
        userId_shiftId_date: {
          userId: user.id,
          shiftId: user.shiftId,
          date: todayDate,
        },
      },
      update: {
        reason,
        status: "PERMISSION",
        approval: "PENDING",
      },
      create: {
        userId: user.id,
        shiftId: user.shiftId,
        date: todayDate,
        reason,
        status: "PERMISSION",
        approval: "PENDING",
      },
    })

    return NextResponse.json({ success: true, data: attendance })
  } catch (err) {
    console.error("❌ permission API error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
