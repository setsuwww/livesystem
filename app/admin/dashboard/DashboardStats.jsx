"use client"

import { EllipsisVertical } from "lucide-react"
import React from "react"
import Link from "next/link"

function DashboardStatsComponent({
  title,
  link,
  textlink,
  caption,
  value,
  valueColor = "",
  icon,
  color,
  dark = false, // default light mode
}) {
  const base =
    "p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors"

  // default theme styles
  const theme = dark
    ? "border-gray-500 bg-gray-600 text-gray-100 hover:border-zinc-600"
    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"

  const defaultIcon =
    dark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"

  return (
    <div className={`${base} ${theme}`}>
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-full ${
          color || defaultIcon
        }`}
      >
        {icon}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">{title}</h2>
          {link && (
            <Link href={link}>
              <EllipsisVertical
                strokeWidth={2}
                size={15}
                className={dark ? "text-zinc-400" : "text-zinc-500"}
              />
              {textlink}
            </Link>
          )}
        </div>
        <p className="flex items-center text-xl font-semibold">
          {caption && (<span className="mr-2">{caption}</span>)}
          <span className={valueColor}>{value}</span>
        </p>
      </div>
    </div>
  )
}

export const DashboardStats = React.memo(DashboardStatsComponent)
