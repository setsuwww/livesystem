import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.shiftId) {
      return NextResponse.json({ error: "Shift ID is required" }, { status: 400 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: user.id,              // ✅ harus ada
        shiftId: data.shiftId,        // ✅ harus ada
        date: new Date(),
        status: "PRESENT",
        reason: data.reason || null,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Attendance Checkin Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
