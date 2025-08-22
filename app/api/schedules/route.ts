// app/api/schedules/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.description || !body.date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const schedule = await prisma.schedule.create({
    data: {
      title: String(body.title),
      description: String(body.description),
      date: new Date(body.date),
      userId: user.id,
      shiftId: body.shiftId ? Number(body.shiftId) : null,
    },
  });

  return NextResponse.json(schedule, { status: 201 });
}

export async function DELETE(req: Request) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try { const body = await req.json().catch(() => ({}));
    const ids: number[] | undefined = body.ids;

    if (ids && ids.length > 0) { await prisma.schedule.deleteMany({
        where: { id: { in: ids }, userId: user.id },
      });
      return NextResponse.json({ message: "Selected schedules deleted" });
    } else { await prisma.schedule.deleteMany({
        where: { userId: user.id },
      });
      return NextResponse.json({ message: "All schedules deleted" });
    }
  } 
  catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

