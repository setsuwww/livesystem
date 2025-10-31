import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma } from "./prisma"

const SECRET = process.env.JWT_SECRET || "secret-key"

export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: "7d" })

export async function setAuthCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set("token", token, { httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  })
}

export async function removeAuthCookie() { const cookieStore = await cookies()
  cookieStore.set("token", "", { maxAge: 0, path: "/" })
}

export async function getUserFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) { console.log("🚫 No token found in cookie")
    return null
  }

  try { const decoded = jwt.verify(token, SECRET)
    return decoded
  } 
  catch (err) { console.error("❌ Invalid token:", err)
    return null
  }
}

export async function getCurrentUser() {
  try { const decoded = await getUserFromCookie()
    if (!decoded?.id) return null

    const user = await prisma.user.findUnique({ where: { id: Number(decoded.id) },
      include: { shift: true, division: true }
    })

    return user
  } 
  catch (err) { console.error("getCurrentUser error:", err)
    return null
  }
}
