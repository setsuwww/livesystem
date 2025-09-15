import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  // pastikan path prisma client bener

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, shiftName, startTime, endTime, userIds } = body;

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

    // 2. Assign users ke shift baru
    if (userIds && userIds.length > 0) {
      await prisma.userShiftAssignment.createMany({
        data: userIds.map((userId) => ({
          userId,
          shiftId: newShift.id,
        })),
        skipDuplicates: true, // biar gak error kalo udah ada
      });
    }

    return NextResponse.json(newShift, { status: 201 });
  } catch (error) {
    console.error("Error creating shift:", error);
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}
