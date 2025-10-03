import { getUserFromToken } from "@/lib/auth";
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req) {
  try {
    const body = await req.json()
    const { title, description, frequency, userIds, dates } = body

    if (!title || !description || !userIds?.length || !dates?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("REQ BODY:", body)

    const schedule = await prisma.schedule.create({
      data: {
        title,
        description,
        frequency,
        users: {
          create: userIds
            .filter((id) => id) // buang null/undefined
            .map((id) => ({
              user: { connect: { id } }
          })),
        },

        // assign dates
        dates: {
          create: dates.map((d) => ({
            date: new Date(d.date),
            shiftId: d.shiftId ? parseInt(d.shiftId) : null,
            secondShiftId: d.secondShiftId
              ? parseInt(d.secondShiftId)
              : null,
          })),
        },
      },
      include: {
        users: { include: { user: true } },
        dates: { include: { shift: true } },
      },
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (err) {
    console.error("Error creating schedule:", err)
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try { const body = await req.json().catch(() => ({}));
    const ids = body.ids;

    if (ids && ids.length > 0) { await prisma.schedule.deleteMany({
        where: { id: { in: ids }, userId: user.id },
      });
      return NextResponse.json({ message: "Selected schedules deleted" });
    } else { await prisma.schedule.deleteMany({
        where: { userId: user.id },
      });
      return NextResponse.json({ message: "All schedules deleted" });
    }
  } 
  catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

