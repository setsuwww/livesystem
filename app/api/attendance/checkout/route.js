import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toMinutes(date) {
  return date.getHours() * 60 + date.getMinutes();
}

export async function POST(req) {
  try {
    const userId = 1; // TODO: ambil dari session
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
    const nowMinutes = toMinutes(today);
    const checkoutOpenMinutes = shift.endMinutes - 10;

    if (nowMinutes < checkoutOpenMinutes) {
      return NextResponse.json(
        { error: "Checkout not allowed yet" },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.update({
      where: {
        userId_shiftId_date: {
          userId,
          shiftId: shift.id,
          date: todayDate,
        },
      },
      data: { checkOutTime: today },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
