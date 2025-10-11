import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { newShiftId } = await req.json();

    const shift = await prisma.shift.findUnique({
      where: { id: newShiftId },
    });

    if (!shift) {
      return new Response("Shift not found", { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { shiftId: newShiftId },
    });

    await prisma.userShiftAssignment.create({
      data: {
        userId: user.id,
        shiftId: newShiftId,
      },
    });

    return Response.json({
      message: "Shift updated and history recorded",
    });
  } catch (error) {
    console.error("❌ Error updating shift:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
