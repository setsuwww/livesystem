// app/api/attendance/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user || user.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { shiftId } = body;

  const today = new Date();
  const startOfDay = new Date(today.setHours(0,0,0,0));
  const endOfDay = new Date(today.setHours(23,59,59,999));

  const attendance = await prisma.attendance.updateMany({
    where: {
      userId: user.id,
      shiftId: shiftId,
      date: { gte: startOfDay, lte: endOfDay },
    },
    data: { status: "CHECKOUT" },
  });

  return NextResponse.json(attendance);
}
