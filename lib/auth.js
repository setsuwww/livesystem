import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "secret-key";

// === BUAT TOKEN ===
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

// === SIMPAN TOKEN DI COOKIE ===
export async function setAuthCookie(token) {
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

// === HAPUS TOKEN ===
export async function removeAuthCookie() {
  cookies().set("token", "", { maxAge: 0, path: "/" });
}

// === AMBIL RAW TOKEN (string) ===
export function getUserFromCookie() {
  const cookieStore = cookies();
  return cookieStore.get("token")?.value || null;
}

// === AMBIL USER LANGSUNG (object) ===
export function getUserFromToken() {
  const token = getUserFromCookie(); // pake cadangan
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET); // -> { id, name, role }
  } catch {
    return null;
  }
}
