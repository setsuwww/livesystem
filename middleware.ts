// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET_STRING } from "./lib/jwt";

const roleRoutes = {
  ADMIN: "/admin/dashboard",
  MANAGER: "/manager/dashboard",
  USER: "/user/dashboard",
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;
  const publicPaths = ["/auth/login", "/auth/register"];

  if (!token) {
    if (!publicPaths.includes(path)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_STRING)
    );

    if (publicPaths.includes(path)) {
      return NextResponse.next();
    }

    if (path.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL(roleRoutes[payload.role as keyof typeof roleRoutes], req.url));
    }
    if (path.startsWith("/manager") && payload.role !== "MANAGER") {
      return NextResponse.redirect(new URL(roleRoutes[payload.role as keyof typeof roleRoutes], req.url));
    }
    if (path.startsWith("/user") && payload.role !== "USER") {
      return NextResponse.redirect(new URL(roleRoutes[payload.role as keyof typeof roleRoutes], req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Invalid token:", err);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*", "/user/:path*"],
};
