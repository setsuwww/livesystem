import { prisma } from "@/lib/prisma";

export async function markAttendance(userId, shiftId, reason) {
  const now = new Date();
  
  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  if (!shift) throw new Error("Shift not found");

  const shiftStart = new Date(now);
  shiftStart.setHours(shift.startTime.getUTCHours(), shift.startTime.getUTCMinutes(), 0, 0);

  if (reason) { const permission = await prisma.permission.findFirst({
      where: { userId, shiftId, date: new Date(now.toDateString()) },
    });

    if (permission?.status === "ACCEPTED") status = "PERMISSION";
    else status = "ABSENT";
    
  } 
  else {
    if (now <= shiftStart) status = "PRESENT";
    else status = "LATE";
  }

  return await prisma.attendance.create({
    data: {
      userId,
      shiftId,
      date: now,
      status,
      reason,
    },
  });
}
