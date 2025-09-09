import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET = process.env.JWT_SECRET || "secret-key";

// 🔹 Generate JWT
export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: "7d" });

// 🔹 Set cookie auth
export async function setAuthCookie(token) { const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// 🔹 Hapus cookie auth
export async function removeAuthCookie() { const cookieStore = await cookies();
  cookieStore.set("token", "", { maxAge: 0, path: "/" });
}

// 🔹 Ambil token dari cookie
export async function getUserFromCookie() { const cookieStore = await cookies(); // ✅ harus pakai await
  return cookieStore.get("token")?.value || null;
}

// 🔹 Decode token
export async function getUserFromToken() { const token = await getUserFromCookie();
  if (!token) return null;

  try { return jwt.verify(token, SECRET) } 
  catch { return null }
}

// 🔹 Ambil data user dari DB
export async function getCurrentUser() { const token = await getUserFromCookie();
  if (!token) return null;

  try { const decoded = jwt.verify(token, SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    return user;
  } 
  catch (error) { console.error("getCurrentUser error:", error);
    return null;
  }
}
