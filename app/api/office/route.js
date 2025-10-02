import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const offices = await prisma.office.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(offices);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const office = await prisma.office.create({
      data: {
        name: body.name,
        location: body.location,
        longitude: body.longitude,
        latitude: body.latitude,
        radius: body.radius,
        type: body.type || "WFO",
        status: body.status || "INACTIVE",
        startTime: body.startTime,
        endTime: body.endTime,
      },
    });
    return Response.json(office);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}