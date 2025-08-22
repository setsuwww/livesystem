// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies(); // await di sini
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies(); // await di sini
  cookieStore.delete("token");
}

export async function getUserFromToken(): Promise<{ id: number } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (typeof payload === "object" && payload && "id" in payload) {
      const id = Number((payload as any).id);
      if (isNaN(id)) return null;
      return { id };
    }
    return null;
  } catch {
    return null;
  }
}

export function getSession() {
  return getServerSession(authConfig);
}

  