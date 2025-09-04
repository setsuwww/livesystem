import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth"; // helper kamu

export async function POST(req) {
  try {
    const user = await getCurrentUser(); // 🔑 ambil user dari cookie
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason } = await req.json();

    const today = new Date();
    const todayDate = new Date(today.toDateString());

    if (!user.shiftId) {
      return NextResponse.json({ error: "No shift assigned" }, { status: 400 });
    }

    // Simpan permission
    const permission = await prisma.permissionRequest.create({
      data: {
        userId: user.id,
        shiftId: user.shiftId,
        date: todayDate,
        reason,
      },
    });

    // Update attendance jadi PERMISSION
    const attendance = await prisma.attendance.upsert({
      where: {
        userId_shiftId_date: {
          userId: user.id,
          shiftId: user.shiftId,
          date: todayDate,
        },
      },
      update: { status: "PERMISSION", reason },
      create: {
        userId: user.id,
        shiftId: user.shiftId,
        date: todayDate,
        status: "PERMISSION",
        reason,
      },
    });

    return NextResponse.json({ success: true, permission, attendance });
  } catch (err) {
    console.error("permission API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
