import { NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"

export async function GET(req, { params }) {
  const { id } = params

  try {
    const users = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
        NOT: { id: parseInt(id) },
      },
      select: {
        id: true,
        name: true,
        email: true,
        shift: true,
      },
      orderBy: { createdAt: "desc" },
    })


    return NextResponse.json(users)
  }
  catch (error) {
    console.error("GET switch users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST tuker shift
export async function POST(req, { params }) {
  try {
    const userAId = parseInt(params.id)
    const body = await req.json()
    const { otherUserId } = body

    if (!userAId || !otherUserId) {
      return NextResponse.json({ error: "Missing user ID(s)" }, { status: 400 })
    }

    const [userA, userB] = await Promise.all([
      prisma.user.findUnique({ where: { id: userAId }, select: { shiftId: true } }),
      prisma.user.findUnique({ where: { id: otherUserId }, select: { shiftId: true } }),
    ])

    if (!userA || !userB) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userAId },
        data: { shiftId: userB.shiftId },
      }),
      prisma.user.update({
        where: { id: otherUserId },
        data: { shiftId: userA.shiftId },
      }),
    ])

    return NextResponse.json({
      message: "Shifts swapped successfully",
      userA: { id: userAId, newShiftId: userB.shiftId },
      userB: { id: otherUserId, newShiftId: userA.shiftId },
    })
  } catch (error) {
    console.error("Switch shift error:", error)
    return NextResponse.json({ error: "Failed to switch shifts" }, { status: 500 })
  }
}
