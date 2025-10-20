import { NextResponse } from "next/server";
import { prisma } from "@/_lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req, { params }) {
  try { const id = parseInt(params.id);
    const user = await prisma.user.findUnique({ where: { id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } 
  catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try { const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } 
  catch (error) {
    console.error("DELETE /users/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
