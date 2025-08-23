import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req, {
  params
}) {
  try {
    const id = parseInt(params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH( request, {
  params
}) {
  try { const body = await request.json();
    const { name, email, password, role, shiftId } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    const dataToUpdate = { name, email, role, shiftId: shiftId ?? null};
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

export async function PUT(req) {
  try { const { id, name, email, role, shifts } = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        shift: {
          create: shifts.map((shift) => ({
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


export async function DELETE(req, {
  params
}) {
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
