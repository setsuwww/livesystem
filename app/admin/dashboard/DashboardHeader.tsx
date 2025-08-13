"use client"

import React from "react"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
}

export const DashboardHeader = React.memo<DashboardHeaderProps>(function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const formatLabel = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-700">
          {title || formatLabel(segments[segments.length - 1] || "Home")}
        </h1>
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center space-x-6">
        <nav className="text-sm text-gray-500">
          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/")
            const isLast = index === segments.length - 1

            return (
              <span key={index}>
                {!isLast ? (
                  <Link href={href} className="font-semibold text-gray-700">
                    {formatLabel(segment)}
                  </Link>
                ) : (
                  <span className="text-gray-500">{formatLabel(segment)}</span>
                )}
                {!isLast && <span className="mx-2">/</span>}
              </span>
            )
          })}
        </nav>
        <Link href="/logout" className="flex items-center gap-x-1 px-4 py-1.5 text-sm font-semibold shadow-sm rounded-lg text-gray-500 bg-gray-200 hover:text-red-700 hover:bg-red-200">
          <LogOut strokeWidth={2.5} size={15} />
          Logout
        </Link>
      </div>
    </header>
  )
})