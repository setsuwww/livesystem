import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    let config = await prisma.systemConfig.findFirst()
    if (!config) {
      config = await prisma.systemConfig.create({
        data: { allWfaActive: false },
      })
    }
    return NextResponse.json(config)
  } catch (err) {
    console.error("❌ Error fetching system config:", err)
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { allWfaActive } = await request.json()

    const updated = await prisma.systemConfig.updateMany({
      data: { allWfaActive },
    })

    if (updated.count === 0) {
      await prisma.systemConfig.create({ data: { allWfaActive } })
    }

    return NextResponse.json({ success: true, allWfaActive })
  } catch (err) {
    console.error("❌ Error updating config:", err)
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}
