import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, shiftId, status, reason } = await req.json();

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        shiftId,
        status,
        reason,
        date: new Date(),
      },
    });

    return new Response(JSON.stringify(attendance), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
