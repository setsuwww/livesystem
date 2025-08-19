import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH( request: Request, { params }: { params: { id: string } }) {
  try { const body = await request.json();
    const { name, email, password, role, shiftId } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    const dataToUpdate: any = { name, email, role, shiftId: shiftId ?? null};
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(params.id) },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedUser);
  } 
  catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ message: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try { const { id, name, email, role, shifts } = await req.json();
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
  } 
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try { const id = parseInt(params.id, 10);
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } 
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
