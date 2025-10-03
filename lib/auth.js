import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET = process.env.JWT_SECRET || "secret-key";

export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: "7d" });

export async function setAuthCookie(token) { const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function removeAuthCookie() { const cookieStore = await cookies();
  cookieStore.set("token", "", { maxAge: 0, path: "/" });
}

export async function getUserFromCookie() { 
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null
  console.log("🍪 token from cookie:", token)
  return token
}

export async function getUserFromToken() { const token = await getUserFromCookie();
  if (!token) return null;

  try { return jwt.verify(token, SECRET) } 
  catch { return null }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, SECRET)
    const userId = Number(decoded.id)
    return await prisma.user.findUnique({ where: { id: userId } })
  } catch (err) {
    console.error("getCurrentUser error:", err)
    return null
  }
}