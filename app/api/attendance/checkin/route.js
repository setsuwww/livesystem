// app/api/attendance/checkin/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shiftId, reason } = await req.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ambil shift detail
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    const now = new Date();
    const shiftStart = new Date(today);
    const [startHour, startMinute] = [
      shift.startTime.getHours(),
      shift.startTime.getMinutes(),
    ];
    shiftStart.setHours(startHour, startMinute, 0, 0);

    const diffMinutes = Math.floor((now - shiftStart) / 1000 / 60);

    let status = "PRESENT";

    if (reason) {
      status = "PERMISSION";
    } else if (diffMinutes > 30) {
      status = "ALPHA";
    } else if (diffMinutes > 0) {
      status = "LATE";
    } else {
      status = "PRESENT";
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_shiftId_date: { userId: user.id, shiftId, date: today },
      },
      update: {
        status,
        checkInTime: now,
        reason: reason || null,
      },
      create: {
        userId: user.id,
        shiftId,
        date: today,
        status,
        checkInTime: now,
        reason: reason || null,
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
