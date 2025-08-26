import { getUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userData = await getUserFromCookie();
  if (!userData) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userData.id },
    include: { shift: true },
  });

  return Response.json(user);
}
