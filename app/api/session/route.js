import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const sessionToken = cookies().get("session_token")?.value;
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: "Tidak ada sesi" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await prisma.user.findFirst({
    where: { sessionToken },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "Pengguna tidak ditemukan" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}