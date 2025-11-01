"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/_lib/prisma"

export async function createDivision(formData) {
  try {
    const payload = {
      name: formData.name,
      location: formData.location,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      radius: formData.radius ? parseInt(formData.radius) : null,
      type: formData.type,
      status: formData.status,
      startTime: formData.startTime,
      endTime: formData.endTime,
    }

    if (!payload.name || !payload.location || !payload.type || !payload.status) {
      throw new Error("Missing required fields")
    }

    await prisma.division.create({ data: payload })
    revalidatePath("/admin/dashboard/divisions")

    return { success: true, message: "Division created successfully" }
  } 
  catch (error) { return { success: false, message: "Failed to create division" }}
}
