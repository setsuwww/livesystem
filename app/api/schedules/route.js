import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      frequency,
      startDate, startTime,
      endDate, endTime,
      userIds,
    } = body

    if (!title || !userIds?.length || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("REQ BODY:", body)

    const schedule = await prisma.schedule.create({
      data: {
        title,
        description,
        frequency,
        startDate: new Date(startDate), startTime,
        endDate: new Date(endDate), endTime,
        users: { create: userIds.map((id) => ({
            user: { connect: { id } },
          })),
        },
      },
      include: {
        users: { include: { user: true } },
      },
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (err) {
    console.error("Error creating schedule:", err)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}

export async function DELETE(req) {
  const user = await getUserFromToken()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json().catch(() => ({}))
    const ids = body.ids

    if (ids && ids.length > 0) { await prisma.schedule.deleteMany({
        where: { id: { in: ids } },
      })
      return NextResponse.json({ message: "Selected schedules deleted" })
    } 
    else { await prisma.schedule.deleteMany()
      return NextResponse.json({ message: "All schedules deleted" })
    }
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
