import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST( req, { params }) {
  try { const userAId = parseInt(params.id);
    const body = await req.json();
    const { otherUserId } = body;

    if (!userAId || !otherUserId) {
      return NextResponse.json(
        { error: "Missing user ID(s)" },
        { status: 400 }
      );
    }

    // ambil kedua user
    const [userA, userB] = await Promise.all([
      prisma.user.findUnique({ where: { id: userAId }, select: { shiftId: true } }),
      prisma.user.findUnique({ where: { id: otherUserId }, select: { shiftId: true } }),
    ]);

    if (!userA || !userB) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // transaksi tuker shiftId
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userAId },
        data: { shiftId: userB.shiftId },
      }),
      prisma.user.update({
        where: { id: otherUserId },
        data: { shiftId: userA.shiftId },
      }),
    ]);

    return NextResponse.json({
      message: "Shifts swapped successfully",
      userA: { id: userAId, newShiftId: userB.shiftId },
      userB: { id: otherUserId, newShiftId: userA.shiftId },
    });
  } catch (error) {
    console.error("Switch shift error:", error);
    return NextResponse.json(
      { error: "Failed to switch shifts" },
      { status: 500 }
    );
  }
}
