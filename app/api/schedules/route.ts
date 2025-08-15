import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function getUserFromToken(): Promise<{ id: number } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (typeof payload === "object" && payload && "id" in payload) {
      const id = Number((payload as any).id);
        if (isNaN(id)) return null;
        return { id };
    } return null;
  } 
  catch {
    return null;
  }
}

export async function GET() {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const schedules = await prisma.schedule.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(schedules);
}

export async function POST(req: Request) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (!body.title || !body.description || !body.date) {return NextResponse.json({ error: "Missing fields" }, { status: 400 })}

  const schedule = await prisma.schedule.create({
    data: {
      title: String(body.title),
      description: String(body.description),
      date: new Date(body.date),
      userId: user.id,
    },
  });

  return NextResponse.json(schedule, { status: 201 });
}
