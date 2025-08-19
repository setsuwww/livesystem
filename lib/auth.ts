// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // ganti di .env

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

  