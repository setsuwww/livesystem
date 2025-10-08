import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ✅ GET all offices (pagination optional)
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page")) || 1
  const pageSize = 5

  const [offices, total] = await Promise.all([
    prisma.office.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.office.count(),
  ])

  return NextResponse.json({
    data: offices,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  })
}

export async function POST(request) {
  try {
    const body = await request.json()

    const newOffice = await prisma.office.create({
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

    return NextResponse.json(newOffice, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating office:", error)
    return NextResponse.json(
      { message: "Failed to create office" },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { activateType, deactivateType, isActive } = body

    if (isActive) {
      await prisma.office.updateMany({
        where: { type: activateType },
        data: { status: "ACTIVE" },
      })
      await prisma.office.updateMany({
        where: { type: deactivateType },
        data: { status: "INACTIVE" },
      })
    } else {
      await prisma.office.updateMany({
        where: { type: activateType },
        data: { status: "INACTIVE" },
      })
      await prisma.office.updateMany({
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

