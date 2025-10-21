"use server"

import { prisma } from "@/_lib/prisma"
import { revalidatePath } from "next/cache"

export async function updatePermissionStatus(id, newStatus, adminReason = null) {
  try {
    const permission = await prisma.permissionRequest.update({
      where: { id: Number(id) },
      data: {
        status: newStatus,
        adminReason: adminReason || null,
      },
      include: { user: true },
    })

    await prisma.attendance.updateMany({
      where: {
        userId: permission.userId,
        date: permission.date,
      },
      data: {
        status: newStatus === "ACCEPTED" ? "PERMISSION" : "ABSENT",
        reason: newStatus === "REJECTED" 
          ? adminReason || "Permission request rejected" 
          : undefined,
      },
    })

    revalidatePath("/admin/requests")

    return { success: true }
  } catch (err) {
    console.error("Update permission status failed:", err)
    return { success: false, message: "Failed to update permission status" }
  }
}


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

