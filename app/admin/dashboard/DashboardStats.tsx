"use client"

import { Plus } from "lucide-react"
import React from "react"

import { DashboardStatsProps } from '@/static/interfaces/DashboardStatsProps';

function DashboardStatsComponent({ title, value, icon, color = "bg-gray-100 text-gray-600" }: DashboardStatsProps) {
  return (
    <div className="p-5 rounded-2xl border border-gray-200 shadow-sm bg-white flex items-center gap-4 hover:border-gray-300 transition-colors">
      <div className={`flex items-center justify-center w-14 h-14 rounded-full ${color} shadow-inner`}>
        {icon}
      </div>

      <div className="flex flex-col flex-1">
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        <div className="flex items-center space-x-1 text-gray-500">
          <p className="text-2xl font-semibold">{value}</p>
          <Plus className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  )
}

export const DashboardStats = React.memo(DashboardStatsComponent)
