import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";


// Update schedule
export async function PUT(req, {
  params
}) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const updated = await prisma.schedule.updateMany({
    where: { id: Number(params.id), userId: user.id },
    data: {
      title: String(body.title),
      description: String(body.description),
      date: new Date(body.date),
      shiftId: body.shiftId ? Number(body.shiftId) : null, // 👈 tambahkan ini
    },
  });

  if (updated.count === 0) {
    return NextResponse.json(
      { error: "Not found or no permission" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Updated" });
}


// Delete schedule
export async function DELETE(req, {
  params
}) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const deleted = await prisma.schedule.deleteMany({
    where: { id: Number(params.id), userId: user.id },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found or no permission" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" });
}
