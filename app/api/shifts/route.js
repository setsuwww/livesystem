import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, startTime, endTime, userIds } = body;

    if (!type || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // convert "HH:mm" → ISO Date
    const today = new Date().toISOString().split("T")[0];
    const start = new Date(`${today}T${startTime}:00Z`);
    const end = new Date(`${today}T${endTime}:00Z`);

    const shift = await prisma.shift.create({
      data: {
        type,
        startTime: start,
        endTime: end,
        users: userIds?.length
          ? { connect: userIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error("POST /shifts error:", error);
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}
