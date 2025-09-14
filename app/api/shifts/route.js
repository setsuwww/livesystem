import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
<<<<<<< HEAD
    const { type, startTime, endTime, userIds } = body;
=======
    const { type, shiftName, startTime, endTime, userIds } = body;
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf

    if (!type || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
<<<<<<< HEAD
    
    // convert "HH:mm" → ISO Date
    const today = new Date().toISOString().split("T")[0];
    const start = new Date(`${today}T${startTime}:00Z`);
    const end = new Date(`${today}T${endTime}:00Z`);
=======
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf

    const shift = await prisma.shift.create({
      data: {
        type,
<<<<<<< HEAD
        startTime: start,
        endTime: end,
        users: userIds?.length
          ? { connect: userIds.map((id) => ({ id })) }
          : undefined,
      },
    });

=======
        shiftName,
        startTime, 
        endTime,
      },
    });

    if (userIds && userIds.length > 0) {
      await prisma.schedule.createMany({
        data: userIds.map((id) => ({
          userId: id,
          shiftId: shift.id,
          date: new Date(),
        })),
      });
    }

>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error("POST /shifts error:", error);
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}
