"use client"

import React from "react"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const DashboardHeader = React.memo(function DashboardHeader({
  title,
  subtitle
}) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const formatLabel = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
      <div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-sky-600">
          {title || formatLabel(segments[segments.length - 1] || "Home")}
        </h1>
        <p className="text-sm text-zinc-500 tracking-tight">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <nav className="text-sm text-zinc-500">
          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/")
            const isLast = index === segments.length - 1

            return (
              <span key={index}>
                {!isLast ? (
                  <Link href={href} className="font-semibold text-zinc-700">
                    {formatLabel(segment)}
                  </Link>
                ) : (
                  <span className="text-zinc-500">{formatLabel(segment)}</span>
                )}
                {!isLast && <span className="mx-2">/</span>}
              </span>
            )
          })}
        </nav>
        <Link href="/logout" className="flex items-center gap-x-1 px-4 py-1.5 text-sm font-semibold rounded-lg text-zinc-500 bg-zinc-100 hover:text-red-700 hover:bg-red-200">
          <LogOut strokeWidth={2.5} size={15} />
          Logout
        </Link>
      </div>
    </header>
  )
})