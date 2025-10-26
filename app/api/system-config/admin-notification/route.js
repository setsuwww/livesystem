import { NextResponse } from "next/server";
import { prisma } from "@/_lib/prisma";
import { getCurrentUser } from "@/_lib/auth";

export async function GET() {
  try { const user = await getCurrentUser();
    if (!user) return NextResponse.json({ hasNotifications: false });

    const pendingPermissions = await prisma.attendance.count({
      where: {
        status: "PERMISSION",
        approval: "PENDING",
      },
    });

    const pendingShiftChanges = await prisma.shiftChangeRequest.count({
      where: {
        status: "PENDING",
      },
    });

    const hasNotifications =
      pendingPermissions > 0 || pendingShiftChanges > 0;

    return NextResponse.json({
      hasNotifications,
      pendingPermissions,
      pendingShiftChanges,
    });
  } 
  catch (error) { console.error("❌ Notification fetch error:", error);
    return NextResponse.json(
      { error: "Server error", hasNotifications: false }, { status: 500 }
    );
  }
}
