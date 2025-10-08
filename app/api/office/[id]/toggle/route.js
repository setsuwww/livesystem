import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req, { params }) {
  const { id } = params

  const office = await prisma.office.findUnique({ where: { id: Number(id) } })
  if (!office) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const newStatus = office.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
  const updated = await prisma.office.update({
    where: { id: Number(id) },
    data: { status: newStatus },
  })

  return NextResponse.json(updated)
}