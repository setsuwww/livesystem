import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true,
        updatedAt: true,
        shift: { select: {
            id: true,
            type: true,
            startTime: true, endTime: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      where: { role: "EMPLOYEE" },
    });

    const latestUpdate = users[0]?.updatedAt ? new Date(users[0].updatedAt).getTime() : 0;
    const ifModifiedSince = req.headers.get("if-modified-since");

    if (ifModifiedSince && parseInt(ifModifiedSince) >= latestUpdate) return new NextResponse(null, { status: 304 });
    return NextResponse.json(users, { headers: { "Last-Modified": latestUpdate.toString() } });
  } 
  catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password, role, shiftId, officeId } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "USER",
      ...(shiftId && { shiftId: parseInt(shiftId) }),
      ...(officeId && { officeId: parseInt(officeId) }),
    }

    const user = await prisma.user.create({
      data: userData,
      include: {
        shift: { select: { id: true, name: true, startTime: true, endTime: true } },
        office: { select: { id: true, name: true, location: true } },
      },
    })

    return NextResponse.json(
      { message: "User created successfully ✅", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try { const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true });
  } 
  catch (error) { console.error(error);
    return NextResponse.json({ error: "Failed to delete users" }, { status: 500 });
  }
}
