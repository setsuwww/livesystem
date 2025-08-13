import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/schedules
export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        shift: true,
        user: true,
      },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
  }
}

// POST /api/schedules
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const schedule = await prisma.schedule.create({
      data: {
        title: body.title,
        userId: body.userId,
        shiftId: body.shiftId,
        date: new Date(body.date),
      },
    });
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 400 });
  }
}
