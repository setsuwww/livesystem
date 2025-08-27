// app/api/attendance/permission/route.js
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { shiftId, reason } = await req.json()
    if (!shiftId || !reason) {
      return NextResponse.json({ error: "shiftId & reason required" }, { status: 400 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0) // normalize tanggal hari ini

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_shiftId_date: { userId: user.id, shiftId, date: today },
      },
      update: {
        status: "PERMISSION",
        reason,
      },
      create: {
        userId: user.id,
        shiftId,
        date: today,
        status: "PERMISSION",
        reason,
      },
    })

    return NextResponse.json({ success: true, attendance })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
