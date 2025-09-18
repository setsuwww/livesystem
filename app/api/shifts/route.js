import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  // pastikan path prisma client bener

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, shiftName, startTime, endTime } = body;

    if (!shiftName || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Shift name, start time, and end time are required" },
        { status: 400 }
      );
    }

    // 1. Buat shift baru
    const newShift = await prisma.shift.create({
      data: {
        type,
        shiftName,
        startTime,
        endTime,
      },
    });

    return NextResponse.json(newShift, { status: 201 });
  } 
  catch (error) { console.error("Error creating shift:", error);
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}
