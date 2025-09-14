import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, shiftName, startTime, endTime, userIds } = body;

    if (!type || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Buat shift baru
    const shift = await prisma.shift.create({
      data: {
        type,
        shiftName,
        startTime,
        endTime,
      },
    });

    // 2. Tag user → bikin record di schedule
    if (userIds && userIds.length > 0) {
      await prisma.schedule.createMany({
        data: userIds.map((id) => ({
          userId: id,
          shiftId: shift.id,
          date: new Date(),
          title: `${shiftName || type} Assignment`, // isi title biar ga error
        })),
      });
    }

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error("POST /shifts error:", error);
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}
