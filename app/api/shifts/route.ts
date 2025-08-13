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
      },
      orderBy: {
        type: 'asc'
      }
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