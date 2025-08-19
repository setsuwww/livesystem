"use client"

import { ArrowDown, ArrowUp, EllipsisVertical } from "lucide-react"
import React, { useState } from "react"

import { DashboardStatsProps } from '@/static/interfaces/DashboardStatsProps';
import Link from "next/link";

function DashboardStatsComponent({ title, link, textlink, value, negativeValue, icon, color = "bg-gray-100 text-gray-600" }: DashboardStatsProps) {
  const [showNegative, setShowNegative] = useState(false);

  const toggleValue = () => setShowNegative(prev => !prev);

  return (
    <div className="p-5 rounded-2xl border border-gray-200 shadow-sm bg-white flex items-center gap-4 hover:border-gray-300 transition-colors">
      <div className={`flex items-center justify-center w-14 h-14 rounded-full ${color} shadow-inner`}>
        {icon}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">{title}</h2>
          {link && ((
            <Link href={link}>
              <EllipsisVertical strokeWidth={2} size={15} className="text-gray-500" />
              {textlink}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-semibold">{showNegative ? negativeValue : value}</p>
          {/* Icon switch */}
          <button onClick={toggleValue} className={`${showNegative ? "hover:bg-red-200 bg-red-100" : "hover:bg-green-200 bg-green-100"} p-1 rounded-full text-gray-500 transition-colors`} title={showNegative ? "Show Positive" : "Show Negative"}>
            {showNegative ? <ArrowUp className="w-4 h-4 text-red-500" /> : <ArrowDown className="w-4 h-4 text-green-500" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export const DashboardStats = React.memo(DashboardStatsComponent)
