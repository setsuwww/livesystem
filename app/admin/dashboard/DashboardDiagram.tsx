"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from "recharts"

import { DashboardDiagramProps } from '@/static/interfaces/DashboardDiagramProps';

function DashboardDiagramComponent({ title, description, data, type = "bar", color = "#4f46e5" }: DashboardDiagramProps) {
  let chart: React.ReactElement

  if (type === "bar") {
    chart = (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="2 2" stroke="#d5d7db" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ fontSize: '10' }} />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} barSize={10} />
      </BarChart>
    )
  } else {
    chart = (
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="1 1" stroke="#d5d7db" />
        <XAxis tick={{ fontSize: 10 }}
          dataKey="name"
        />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ fontSize: '12px' }} />
        <Area type="monotone"
          dataKey="value" stroke={color}
          fillOpacity={1} fill="url(#colorValue)"
        />
      </AreaChart>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chart}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export const DashboardDiagram = React.memo(DashboardDiagramComponent)
