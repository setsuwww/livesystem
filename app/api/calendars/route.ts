import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    include: { user: true }
  });
  return NextResponse.json(schedules);
}

export async function POST(req: Request) {
  const { title, date, userId } = await req.json();

  if (!title || !date || !userId) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const schedule = await prisma.schedule.create({
    data: {
      title,
      date: new Date(date),
      userId
    }
  });

  return NextResponse.json(schedule, { status: 201 });
}
