import { prisma } from "@/_lib/prisma";
import { getCurrentUser } from "@/_lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // ✅ Ambil semua attendance user (termasuk izin)
    const attendance = await prisma.attendance.findMany({
      where: { userId: user.id },
      include: {
        shift: { select: { id: true, name: true, type: true } },
      },
      orderBy: { date: "desc" },
    });

    // ✅ Format data agar konsisten
    const formatted = attendance.map((a) => {
      let statusLabel = a.status;

      // Untuk status izin, tampilkan sesuai approval-nya
      if (a.status === "PERMISSION") {
        if (a.approval === "PENDING") statusLabel = "PENDING";
        else if (a.approval === "REJECTED") statusLabel = "REJECTED";
        else statusLabel = "PERMISSION"; // accepted
      }

      return {
        id: `att-${a.id}`,
        date: a.date,
        status: statusLabel,
        reason: a.reason || null,
        shift: a.shift,
        source: a.status === "PERMISSION" ? "permission" : "attendance",
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
      };
    });

    return Response.json(formatted);
  } catch (error) {
    console.error("❌ Error fetching attendance history:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
