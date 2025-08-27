import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function GET() {
  try { const attendances = await prisma.attendance.findMany({
      include: {
        user: true,
        shift: true,
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(attendances)
  } catch (error) {
    console.error("GET /api/attendance error:", error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(req) {
  const body = await req.json();
  const { shiftStart, shiftEnd, checkInTime, hasPermission } = body;

  const status = shiftAttendancesController(
    new Date(shiftStart),
    new Date(shiftEnd),
    checkInTime ? new Date(checkInTime) : null,
    hasPermission
  );

  return NextResponse.json({ status });
}

