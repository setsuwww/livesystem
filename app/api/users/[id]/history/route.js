import { prisma } from "@/_lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  const userId = Number(params.id)

  const history = await prisma.attendance.findMany({ where: { userId },
    include: { shift: true },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(history)
}
