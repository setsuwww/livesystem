"use server"

import { prisma } from "@/_lib/prisma"

export async function updateShiftChangeStatus(id, action, actorRole) {
  const request = await prisma.shiftChangeRequest.findUnique({ where: { id } })
  if (!request) throw new Error("Request not found")

  let newStatus = request.status

  if (actorRole === "TARGET") {
    if (action === "ACCEPT") {
      newStatus = "PENDING_ADMIN"
    } else if (action === "REJECT") {
      newStatus = "REJECTED"
    }
  }

  if (actorRole === "ADMIN") {
    if (action === "APPROVE") {
      newStatus = "APPROVED"
    } else if (action === "REJECT") {
      newStatus = "REJECTED"
    }
  }

  await prisma.shiftChangeRequest.update({
    where: { id },
    data: { status: newStatus },
  })
}

export async function updateRequestStatus(requestId, newStatus, reason = null) {
  try {
    const request = await prisma.shiftChangeRequest.findUnique({
      where: { id: requestId },
      select: { userId: true, targetShiftId: true },
    });

    if (!request) throw new Error("Request not found");

    // Kalau diterima, update shift user
    if (newStatus === "ACCEPTED") {
      await prisma.user.update({
        where: { id: request.userId },
        data: { shiftId: request.targetShiftId },
      });
    }

    const updated = await prisma.shiftChangeRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        ...(reason ? { reason } : {}), // kalau REJECTED, simpan reason
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating request:", error);
    return { success: false, message: error.message };
  }
}