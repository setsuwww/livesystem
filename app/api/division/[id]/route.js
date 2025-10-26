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
  const id = parseInt(params.id, 10);
  try {
    const body = await req.json();
    const division = await prisma.division.update({
      where: { id },
      data: body,
    });
    return Response.json(division);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const id = parseInt(params.id, 10);
  try {
    const division = await prisma.division.delete({
      where: { id },
    });
    return Response.json(division);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
