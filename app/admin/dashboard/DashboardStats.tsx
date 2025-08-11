'use client'

import React from "react"

interface StatCardProps {
  title: string | React.ReactNode
  value: string | number
  icon?: React.ReactNode
  color?: string
}

export function DashboardStats({ title, value, icon, color = "bg-gray-100" }: StatCardProps) {
  return (
    <div className={`p-4 rounded-lg border border-gray-300 shadow-sm flex items-center gap-4`}>
      <div className={`p-4 rounded-lg text-4xl font-semibold ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  )
}
