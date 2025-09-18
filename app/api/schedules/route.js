// app/api/schedules/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, userIds, dates } = body

    console.log("Received schedule data:", { title, description, userIds, dates })

    // Simulate database operations
    for (const userId of userIds) {
      for (const dateInfo of dates) {
        // Create schedule entry for each user and date
        const scheduleData = {
          title,
          description,
          startDate: new Date(dateInfo.date),
          endDate: new Date(dateInfo.date),
          shiftId: Number(dateInfo.shiftId),
          userId: userId,
        }

        console.log("Creating schedule entry:", scheduleData)

        // If there's a second shift, create another entry
        if (dateInfo.secondShiftId) {
          const secondScheduleData = {
            title: `${title} (Second Shift)`,
            description,
            startDate: new Date(dateInfo.date),
            endDate: new Date(dateInfo.date),
            shiftId: Number(dateInfo.secondShiftId),
            userId: userId,
          }
          console.log("Creating second schedule entry:", secondScheduleData)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Schedule created successfully",
      totalEntries: userIds.length * dates.length,
    })
  } catch (error) {
    console.error("Error creating schedule:", error)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
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

