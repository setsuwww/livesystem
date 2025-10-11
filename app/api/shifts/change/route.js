import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req) {
  try {
    const body = await req.json()
    const { userId, startDate, endDate, reason } = body

    const actor = await getCurrentUser()
    if (!actor) {
      return new Response(JSON.stringify({ message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } })
    }

    // validate fields
    if (!userId || !startDate || !reason) {
      return new Response(JSON.stringify({ message: "Missing required fields: userId, startDate, reason" }),
      { status: 400, headers: { "Content-Type": "application/json" } })
    }

    const start = new Date(startDate)
    if (isNaN(start.getTime())) {
      return new Response(JSON.stringify({ message: "Invalid startDate" }),
      { status: 400, headers: { "Content-Type": "application/json" } })
    }

    let end = null
    if (endDate) { end = new Date(endDate)
      if (isNaN(end.getTime())) {
        return new Response(JSON.stringify({ message: "Invalid endDate" }), 
        { status: 400, headers: { "Content-Type": "application/json" } })
      }
      if (end < start) {
        return new Response(JSON.stringify({ message: "endDate must be the same or after startDate" }), 
        { status: 400, headers: { "Content-Type": "application/json" } })
      }
    }

    const targetUser = await prisma.user.findUnique({ where: { id: Number(userId) } })
    if (!targetUser) {
      return new Response(JSON.stringify({ message: "Target user not found" }), 
      { status: 404, headers: { "Content-Type": "application/json" } })
    }

    // create request
    const created = await prisma.shiftChangeRequest.create({
      data: {
        userId: Number(userId),
        requestedById: actor.id,
        reason,
        startDate: start,
        endDate: end,       // requires schema to have endDate DateTime? optional
        status: "PENDING",
      },
    })

    return new Response(JSON.stringify({ message: "Shift change request created", id: created.id }), { status: 201, headers: { "Content-Type": "application/json" } })
  } catch (err) {
    console.error("❌ Error submitting shift change:", err)
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
