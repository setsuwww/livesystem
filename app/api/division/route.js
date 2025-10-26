import { NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page")) || 1
  const pageSize = 5

  const [divisions, total] = await Promise.all([
    prisma.division.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.division.count(),
  ])

  return NextResponse.json({
    data: divisions,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  })
}

export async function POST(request) {
  try {
    const body = await request.json()

    const newDivision = await prisma.division.create({
      data: {
        name: body.name,
        location: body.location,
        longitude: body.longitude,
        latitude: body.latitude,
        radius: body.radius,
        type: body.type,       // enum LocationType
        status: body.status,   // enum LocationStatus
        startTime: body.startTime,
        endTime: body.endTime,
      },
    })

    return NextResponse.json(newDivision, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating division:", error)
    return NextResponse.json(
      { message: "Failed to create division" },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { activateType, deactivateType, isActive } = body

    if (isActive) {
      await prisma.division.updateMany({
        where: { type: activateType },
        data: { status: "ACTIVE" },
      })
      await prisma.division.updateMany({
        where: { type: deactivateType },
        data: { status: "INACTIVE" },
      })
    } else {
      await prisma.division.updateMany({
        where: { type: activateType },
        data: { status: "INACTIVE" },
      })
      await prisma.division.updateMany({
        where: { type: deactivateType },
        data: { status: "ACTIVE" },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Bulk update failed:", error)
    return NextResponse.json(
      { message: "Bulk update failed" },
      { status: 500 }
    )
  }
}

