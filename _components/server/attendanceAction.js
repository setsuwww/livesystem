"use server"

import { prisma } from "@/_lib/prisma"
import { getCurrentUser } from "@/_lib/auth"
import dayjs from "dayjs"

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

export async function userSendCheckIn() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const today = dayjs().startOf("day").toDate()

  await prisma.attendance.upsert({
    where: {
      userId_shiftId_date: {
        userId: user.id,
        shiftId: user.shiftId ?? 0,
        date: today,
      },
    },
    update: {
      checkInTime: new Date(),
      status: "PRESENT",
    },
    create: {
      userId: user.id,
      shiftId: user.shiftId ?? 0,
      date: today,
      status: "PRESENT",
      checkInTime: new Date(),
    },
  })

  return { success: true }
}

export async function userSendCheckOut() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const today = dayjs().startOf("day").toDate()

  await prisma.attendance.updateMany({
    where: {
      userId: user.id,
      date: today,
    },
    data: {
      checkOutTime: new Date(),
    },
  })

  return { success: true }
}

export async function userSendPermissionRequest(reason) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const today = dayjs().startOf("day").toDate()

  await prisma.attendance.upsert({
    where: {
      userId_shiftId_date: {
        userId: user.id,
        shiftId: user.shiftId ?? 0,
        date: today,
      },
    },
    update: {
      status: "PERMISSION",
      approval: "PENDING",
      reason,
    },
    create: {
      userId: user.id,
      shiftId: user.shiftId ?? 0,
      date: today,
      status: "PERMISSION",
      approval: "PENDING",
      reason,
    },
  })

  return { success: true }
}
