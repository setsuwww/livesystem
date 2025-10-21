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

