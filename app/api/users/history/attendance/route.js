import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 🔹 Ambil semua data absensi milik user saat ini
    const history = await prisma.attendance.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      include: {
        shift: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    // 🔹 Format hasilnya biar rapi
    const formatted = history.map((record) => ({
      id: record.id,
      date: record.date,
      status: record.status,
      reason: record.reason,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      shift: record.shift,
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error("❌ Error fetching attendance history:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
