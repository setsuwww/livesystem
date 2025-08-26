import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth";

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
  try {
    const body = await req.json();
    const { userId, shiftId, status, reason, arrivalTime, departureTime, date } = body;

    const attendance = await prisma.attendance.create({
      data: {
        userId: Number(userId),
        shiftId: Number(shiftId),
        status,
        reason,
        arrivalTime: arrivalTime ? new Date(`${date.split("T")[0]}T${arrivalTime}:00`) : null,
        departureTime: departureTime ? new Date(`${date.split("T")[0]}T${departureTime}:00`) : null,
        date: new Date(date),
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (err) {
    console.error("Attendance error:", err);
    return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}

