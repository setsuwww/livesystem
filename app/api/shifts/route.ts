import { toDateFromTimeString } from "@/function/functionFormatters";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
