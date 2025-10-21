import { prisma } from "@/_lib/prisma";
import { getCurrentUser } from "@/_lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Ambil dua data sekaligus
    const [attendance, permissions] = await Promise.all([
      prisma.attendance.findMany({
        where: { userId: user.id },
        include: {
          shift: { select: { id: true, name: true, type: true } },
        },
      }),
      prisma.permissionRequest.findMany({
        where: { userId: user.id },
      }),
    ]);

    // Format biar bentuknya konsisten
    const attendanceData = attendance.map((a) => ({
      id: `att-${a.id}`,
      date: a.date,
      status: a.status,
      reason: a.reason || null,
      shift: a.shift,
      source: "attendance",
      checkInTime: a.checkInTime,
      checkOutTime: a.checkOutTime,
    }));

    const permissionData = permissions.map((p) => ({
      id: `perm-${p.id}`,
      date: p.date,
      status: p.status === "ACCEPTED" ? "PERMISSION" : p.status === "REJECTED" ? "REJECTED" : "PENDING",
      reason: p.reason || null,
      shift: null,
      source: "permission",
      checkInTime: null,
      checkOutTime: null,
    }));

    // Gabungkan & urutkan berdasarkan tanggal (terbaru dulu)
    const combined = [...attendanceData, ...permissionData].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return Response.json(combined);
  } catch (error) {
    console.error("❌ Error fetching attendance + permission history:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
