import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shifts = await prisma.shift.findMany({
      select: {
        id: true,
        type: true,
        customType: true,
        startTime: true,
        endTime: true,
        _count: {
          select: { users: true, schedules: true },
        },
      },
      orderBy: { type: "asc" },
    });

    const formatted = shifts.map((s) => ({
      ...s,
      label: s.type === "CUSTOM" ? s.customType : s.type,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return NextResponse.json(
      { error: "Failed to fetch shifts" },
      { status: 500 }
    );
  }
}

function toDateFromTimeString(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, startTime, endTime, customType, userIds } = body;

    if (!type || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type === "CUSTOM" && !customType) {
      return NextResponse.json(
        { error: "Custom shift must include customType" },
        { status: 400 }
      );
    }

    const shift = await prisma.shift.create({
      data: {
        type,
        customType: type === "CUSTOM" ? customType : null,
        startTime: toDateFromTimeString(startTime),
        endTime: toDateFromTimeString(endTime),
        users: {
          connect: userIds.map((id: number) => ({ id }))
        }
      },
    });

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}
