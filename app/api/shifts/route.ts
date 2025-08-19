import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shifts = await prisma.shift.findMany({
      select: {
        id: true,
        type: true,
        startTime: true,
        endTime: true,
        _count: {
          select: {
            users: true,
            schedules: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        schedules: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
          },
        },
      },
      orderBy: {
        type: "asc",
      },
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return NextResponse.json(
      { error: "Failed to fetch shifts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, startTime, endTime } = body;

    if (!type || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shift = await prisma.shift.create({
      data: {
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      }
    });

    return NextResponse.json(shift, { status: 201 });
  }
  catch (error) {
    return NextResponse.json({ error: "Failed to create shift" }, { status: 500 });
  }
}