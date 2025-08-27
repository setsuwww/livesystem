import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function getAttendanceStatus(shiftStart, now, reason) {
  if (reason) return "PERMISSION";

  const diffMinutes = Math.floor((now - shiftStart) / 1000 / 60);

  if (diffMinutes > 30) return "ALPHA";
  if (diffMinutes > 0) return "LATE";
  return "PRESENT";
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shiftId, reason } = await req.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    const now = new Date();

    // bikin waktu mulai shift untuk hari ini
    const shiftStart = new Date(today);
    shiftStart.setHours(
      shift.startTime.getHours(),
      shift.startTime.getMinutes(),
      0,
      0
    );

    // hitung status
    const status = getAttendanceStatus(shiftStart, now, reason);

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

    // Format hasil sebelum kirim balik
    const formattedAttendance = {
      id: attendance.id,
      userId: attendance.userId,
      shiftId: attendance.shiftId,
      status: attendance.status, // 👈 dipastikan ada
      reason: attendance.reason,
      date: format(attendance.date, "dd MMMM yyyy", { locale: id }),
      checkInTime: attendance.checkInTime
        ? format(attendance.checkInTime, "HH:mm:ss", { locale: id })
        : null,
    };

    return NextResponse.json({ success: true, attendance: formattedAttendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
