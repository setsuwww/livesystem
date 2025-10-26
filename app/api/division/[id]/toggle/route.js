import { prisma } from "@/_lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req, { params }) {
  const { id } = params

  const division = await prisma.division.findUnique({ where: { id: Number(id) } })
  if (!division) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const newStatus = division.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
  const updated = await prisma.division.update({
    where: { id: Number(id) },
    data: { status: newStatus },
  })

  return NextResponse.json(updated)
}