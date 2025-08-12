import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies(); // <-- pakai await
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const decoded = verifyToken(token) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
  }
}
