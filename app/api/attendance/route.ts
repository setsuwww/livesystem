import { prisma } from "@/lib/prisma";
import { evaluateAttendance } from "@/function/handleAttendance";

export async function POST(req: Request) {
  const { userId, shiftId, date, checkInAt, reason, approved } = await req.json();

  // cek shift type
  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  if (!shift) return new Response("Shift not found", { status: 404 });

  const status = evaluateAttendance({
    shiftType: shift.type,
    date: new Date(date),
    checkInAt: checkInAt ? new Date(checkInAt) : null,
    reason,
    approved,
  });

  const attendance = await prisma.attendance.create({ data: {
    userId,
    shiftId,
    date: new Date(date),
    checkInAt: checkInAt ? new Date(checkInAt) : null,
    reason,
    approved,
    status,
  }});

  return Response.json(attendance);
}
