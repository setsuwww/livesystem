import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const userId = 1; // TODO: ambil dari session
    const body = await req.json();
    const { reason } = body;

    const today = new Date();
    const todayDate = new Date(today.toDateString());

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { shift: true },
    });
    if (!user || !user.shift) {
      return NextResponse.json({ error: "No shift assigned" }, { status: 400 });
    }

    const shift = user.shift;

    // Simpan permission
    const permission = await prisma.permissionRequest.create({
      data: {
        userId,
        shiftId: shift.id,
        date: todayDate,
        reason,
      },
    });

    // Update attendance jadi PERMISSION
    const attendance = await prisma.attendance.upsert({
      where: {
        userId_shiftId_date: {
          userId,
          shiftId: shift.id,
          date: todayDate,
        },
      },
      update: { status: "PERMISSION", reason },
      create: {
        userId,
        shiftId: shift.id,
        date: todayDate,
        status: "PERMISSION",
        reason,
      },
    });

    return NextResponse.json({ success: true, permission, attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
