import { NextResponse } from "next/server";
import { prisma } from "@/_lib/prisma";
import { getCurrentUser } from "@/_lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const attendances = await prisma.attendance.findMany({
    where: { userId: user.id },
    include: { shift: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(attendances);
}
