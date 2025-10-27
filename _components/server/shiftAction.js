"use server"

import { prisma } from "@/_lib/prisma"
import dayjs from "dayjs"

export async function updateShiftChangeStatus(id, action, actorRole) {
  const request = await prisma.shiftChangeRequest.findUnique({ where: { id } })
  if (!request) throw new Error("Request not found")

  let newStatus = request.status

  if (actorRole === "TARGET") {
    if (action === "ACCEPT") newStatus = "PENDING_ADMIN"
    if (action === "REJECT") newStatus = "REJECTED"
  }

  if (actorRole === "ADMIN") {
    if (action === "APPROVE") newStatus = "APPROVED"
    if (action === "REJECT") newStatus = "REJECTED"
  }

  const updated = await prisma.shiftChangeRequest.update({
    where: { id },
    data: { status: newStatus },
  })

  return { success: true, data: updated }
}

export async function updateShiftChangeRequestStatus(requestId, newStatus, reason = null) {
  const cleanId = Number(String(requestId).replace(/^(shift-)/, ""))
  if (isNaN(cleanId)) throw new Error("Invalid ID")

  try {
    const request = await prisma.shiftChangeRequest.findUnique({
      where: { id: cleanId },
      select: {
        userId: true,
        targetUserId: true,
        oldShiftId: true,
        targetShiftId: true,
        status: true,
      },
    })

    if (!request) throw new Error("Request not found")

    if (newStatus === "APPROVED") {
      const { userId, targetUserId, oldShiftId, targetShiftId } = request
      if (!targetUserId) throw new Error("Target user tidak ditemukan")

      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { shiftId: targetShiftId },
        }),
        prisma.user.update({
          where: { id: targetUserId },
          data: { shiftId: oldShiftId },
        }),
      ])
    }

    const updated = await prisma.shiftChangeRequest.update({
      where: { id: cleanId },
      data: {
        status: newStatus,
        ...(reason ? { rejectReason: reason } : {}),
      },
    })

    return { success: true, data: updated }
  } catch (error) {
    console.error("Error updating shift change request:", error)
    return { success: false, message: error.message }
  }
}

export async function updatePermissionStatus(requestId, newStatus, reason = null) {
  const cleanId = Number(String(requestId).replace(/^(perm-)/, ""))
  if (isNaN(cleanId)) throw new Error("Invalid permission ID")

  try {
    const attendance = await prisma.attendance.findUnique({
      where: { id: cleanId },
    })

    if (!attendance) throw new Error("Permission request not found")

    const mappedStatus = newStatus.toUpperCase()
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"]

    if (!validStatuses.includes(mappedStatus)) {
      throw new Error(`Invalid approval status: ${newStatus}`)
    }

    const updated = await prisma.attendance.update({
      where: { id: cleanId },
      data: {
        approval: mappedStatus,
        ...(reason ? { adminReason: reason } : {}),
      },
    })

    return { success: true, data: updated }
  } catch (error) {
    console.error("Error updating permission:", error)
    return { success: false, message: error.message }
  }
}

export async function resetExpiredShiftChanges() {
  const now = dayjs()

  const expiredRequests = await prisma.shiftChangeRequest.findMany({
    where: {
      endDate: { lt: now.toDate() },
      status: "APPROVED",
    },
    select: {
      id: true,
      userId: true,
      targetUserId: true,
      oldShiftId: true,
      targetShiftId: true,
    },
  })

  for (const req of expiredRequests) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: { shiftId: req.oldShiftId },
      }),
      prisma.user.update({
        where: { id: req.targetUserId },
        data: { shiftId: req.targetShiftId },
      }),
      prisma.shiftChangeRequest.update({
        where: { id: req.id },
        data: { status: "PENDING" },
      }),
    ])
  }

  return { success: true, count: expiredRequests.length }
}