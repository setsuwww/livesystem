import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

async function getUserFromToken() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch {
    return null;
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const updated = await prisma.schedule.updateMany({
    where: { id: Number(params.id), userId: user.id },
    data: {
      title: body.title,
      date: new Date(body.date),
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Not found or no permission" }, { status: 404 });
  }

  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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
