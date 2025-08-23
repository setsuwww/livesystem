import { removeAuthCookie } from "@/lib/auth";

export async function POST() {
  removeAuthCookie();
  return new Response(JSON.stringify({ message: "Logged out" }), { status: 200 });
}
