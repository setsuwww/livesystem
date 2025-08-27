// app/api/attendance/checkout/route.js
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { shiftId } = await req.json()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attendance = await prisma.attendance.updateMany({
      where: {
        userId: user.id,
        shiftId,
        date: today,
      },
      data: {
        status: "CHECKOUT",
        checkOutTime: new Date(),
      },
    })

    if (attendance.count === 0) {
      return NextResponse.json({ error: "Belum ada check-in" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
