import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const data = await req.json();

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, email, role, shifts } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        shift: {
          create: shifts.map((shift: any) => ({
            type: shift.type,
            startTime: new Date(`${shift.date}T${shift.startTime}:00`),
            endTime: new Date(`${shift.date}T${shift.endTime}:00`)
          }))
        }
      },
      include: { shift: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
