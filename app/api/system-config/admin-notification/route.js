import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ hasNotifications: false });

  const [permissionRequest, shiftChangeRequest] = await Promise.all([
    prisma.permissionRequest.count({ where: { status: "PENDING" } }),
    prisma.shiftChangeRequest.count({ where: { status: "PENDING" } }),
  ]);

  const hasNotifications = permissionRequest > 0 || shiftChangeRequest > 0;

  return NextResponse.json({ hasNotifications });
}
