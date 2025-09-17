"use client"

import React from "react"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const DashboardHeader = React.memo(function DashboardHeader({ title, subtitle }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const formatLabel = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  const visibleSegments = segments.slice(0, 3)

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
      <div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-sky-600">
          {title || formatLabel(visibleSegments[visibleSegments.length - 1] || "Home")}
        </h1>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        <nav className="flex-1 text-sm text-zinc-500">
          {visibleSegments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/")
            const isLast = index === visibleSegments.length - 1

            return (<span key={index}>
                {!isLast ? (
                  <Link href={href} className="font-semibold text-zinc-700">
                    {formatLabel(segment)}
                  </Link>
                ) : (
                  <span className="text-zinc-500">{formatLabel(segment)}</span>
                )}
                {!isLast && <span className="mx-2">/</span>}
              </span>)
          })}
        </nav>

        <Link href="/logout" className="flex items-center gap-x-1 px-4 py-1.5 text-sm font-semibold rounded-lg bg-white border border-zinc-300 text-red-600 hover:border-zinc-400">
          <LogOut strokeWidth={2.5} size={15} />
          Logout
        </Link>
      </div>
    </header>
  )
})
