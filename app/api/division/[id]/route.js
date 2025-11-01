import { prisma } from "@/_lib/prisma";

export async function GET(req, { params }) {
  const id = parseInt(params.id, 10);
  try {
    const division = await prisma.division.findUnique({
      where: { id },
      include: {
        users: true,
        shifts: true,
        schedules: true,
      },
    });
    if (!division) {
      return Response.json({ error: "Division not found" }, { status: 404 });
    }
    return Response.json(division);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return Response.json({ error: "Invalid division ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const {
      name, location, longitude, latitude,
      radius, type, status,
      startTime, endTime,
    } = body;

    if (!name || !location) { return Response.json( { error: "Name and location are required" },
        { status: 400 }
      );
    }

    const updatedDivision = await prisma.division.update({
      where: { id },
      data: {
        name,
        location, longitude: longitude ?? null, latitude: latitude ?? null,
        radius: radius ?? null,
        type,
        status,
        startTime: startTime ?? null, endTime: endTime ?? null,
        updatedAt: new Date(),
      },
    });

    return Response.json(updatedDivision, { status: 200 });
  } 
  catch (error) { console.error("Division update error:", error);
    return Response.json({ error: error.message || "Failed to update division" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  const id = parseInt(params.id, 10);
  try {
    const division = await prisma.division.delete({
      where: { id },
    });
    return Response.json(division);
  } 
  catch (error) { return Response.json({ error: error.message }, { status: 400 })}
}
