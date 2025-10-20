import { removeAuthCookie } from "@/_lib/auth";

export async function POST() { await removeAuthCookie();
  return new Response(JSON.stringify({ message: "Logged out" }), { status: 200 });
}
