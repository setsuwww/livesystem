import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try { const shift = await prisma.shift.findUnique({
      where: { id: parseInt(params.id) },
      include: { users: true, schedules: true },
    });
    if (!shift) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(shift);
  } 
  catch (error) {
    return NextResponse.json({ error: "Failed to fetch shift" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try { const body = await req.json();
    const { type, startTime, endTime } = body;

    const updated = await prisma.shift.update({
      where: { id: parseInt(params.id) },
      data: {
        type,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      }
    });

    return NextResponse.json(updated);
  } 
  catch (error) {
    return NextResponse.json({ error: "Failed to update shift" }, { status: 500 });
  }
}

// DELETE shift
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try { await prisma.shift.delete({
      where: { id: parseInt(params.id) }
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } 
  catch (error) {
    return NextResponse.json({ error: "Failed to delete shift" }, { status: 500 });
  }
}
