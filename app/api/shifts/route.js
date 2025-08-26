import { toDateFromTimeString } from "@/function/helpers/timeHelpers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, startTime, endTime, userIds } = body;

    if (!type || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const shift = await prisma.shift.create({
      data: {
        type,
        startTime: toDateFromTimeString(startTime),
        endTime: toDateFromTimeString(endTime),
        users: {
          connect: userIds.map((id) => ({ id }))
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
