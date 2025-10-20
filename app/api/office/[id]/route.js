import { prisma } from "@/_lib/prisma";

export async function GET(req, { params }) {
  const id = parseInt(params.id, 10);
  try {
    const office = await prisma.office.findUnique({
      where: { id },
      include: {
        users: true,
        shifts: true,
        schedules: true,
      },
    });
    if (!office) {
      return Response.json({ error: "Office not found" }, { status: 404 });
    }
    return Response.json(office);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const id = parseInt(params.id, 10);
  try {
    const body = await req.json();
    const office = await prisma.office.update({
      where: { id },
      data: body,
    });
    return Response.json(office);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const id = parseInt(params.id, 10);
  try {
    const office = await prisma.office.delete({
      where: { id },
    });
    return Response.json(office);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
