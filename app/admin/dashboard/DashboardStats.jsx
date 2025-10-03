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
    ? "border-neutral-500 bg-neutral-600 text-neutral-100 hover:border-neutral-600"
    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"

  const defaultIcon =
    dark ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600"

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
                className={dark ? "text-neutral-400" : "text-neutral-500"}
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
