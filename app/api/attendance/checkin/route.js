import { NextResponse } from "next/server";
import { prisma } from "@/_lib/prisma";
import { getCurrentUser } from "@/_lib/auth";
import { getAttendanceStatus } from "@/_function/services/shiftAttendance"; // aturan logic yang tadi

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const todayDate = new Date(today.toDateString());

    // ambil shift
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { shift: true },
    });
    if (!dbUser || !dbUser.shift) {
      return NextResponse.json({ error: "No shift assigned" }, { status: 400 });
    }

    const shift = dbUser.shift;

    const status = getAttendanceStatus({
      checkIn: today,
      permissionReason: null,
      shift,
    });

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_shiftId_date: {
          userId: user.id,
          shiftId: shift.id,
          date: todayDate,
        },
      },
      update: { checkInTime: today, status },
      create: {
        userId: user.id,
        shiftId: shift.id,
        date: todayDate,
        checkInTime: today,
        status,
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
