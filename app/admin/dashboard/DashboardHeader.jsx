"use client"

import React from "react"
import { LogOut, Inbox } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const DashboardHeader = React.memo(function DashboardHeader({ title, subtitle }) {
  const rightActionClass = "flex items-center text-sm font-semibold rounded-lg bg-white/50 border border-slate-300/70 text-slate-600 hover:bg-white hover:border-slate-300/90 transition-colors"
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const formatLabel = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  const visibleSegments = segments.slice(0, 3)

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
      <div>
        <h1 className="text-xl font-bold text-slate-700">
          {title || formatLabel(visibleSegments[visibleSegments.length - 1] || "Home")}
        </h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        <nav className="flex-1 text-sm text-slate-500">
          {visibleSegments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/")
            const isLast = index === visibleSegments.length - 1

            return (<span key={index}>
                {!isLast ? (
                  <Link href={href} className="font-semibold text-slate-700">
                    {formatLabel(segment)}
                  </Link>
                ) : (
                  <span className="text-slate-500">{formatLabel(segment)}</span>
                )}
                {!isLast && <span className="mx-2">/</span>}
              </span>)
          })}
        </nav>

          <div className="flex items-center gap-x-2">
          <Link href="/request" className={`px-2 py-1.5 ${rightActionClass}`}>
            <Inbox size={20} strokeWidth={2} />
          </Link>
        <Link href="/logout" className={`px-4 py-1.5 gap-x-1 ${rightActionClass}`}>
          <LogOut strokeWidth={2.5} size={15} />
          Logout
        </Link>
        </div>
      </div>
    </header>
  )
})
