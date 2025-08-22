"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from "recharts"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/Select"
import { DashboardDiagramProps } from '@/static/interfaces/DashboardDiagramProps'

type Option = { text: string; url: string }

interface ExtendedDiagramProps extends DashboardDiagramProps {
  select?: boolean
  options?: Option[]
  onSelectChange?: (value: string) => void
}

function DashboardDiagramComponent({
  title,
  description,
  data,
  type = "bar",
  color = "#4f46e5",
  series,
  select = false,
  options = [],
  onSelectChange
}: ExtendedDiagramProps) {

  const renderBars = () =>
    (series ?? [{ key: "value", color }]).map(s => (
      <Bar
        key={s.key}
        dataKey={s.key}
        fill={s.color}
        radius={[4, 4, 0, 0]}
        barSize={14}
        name={s.label || s.key}
      />
    ))

  const renderAreas = () =>
    (series ?? [{ key: "value", color }]).map((s, idx) => {
      const gradientId = `gradient-${s.key}-${idx}`
      return (
        <React.Fragment key={s.key}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={s.key}
            stroke={s.color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            name={s.label || s.key}
          />
        </React.Fragment>
      )
    })

  let chart: React.ReactElement
  if (type === "bar") {
    chart = (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "0.5rem",
            fontSize: "12px",
            color: "white"
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#6b7280" }} />
        {renderBars()}
      </BarChart>
    )
  } else {
    chart = (
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "0.5rem",
            fontSize: "12px",
            color: "white"
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#6b7280" }} />
        {renderAreas()}
      </AreaChart>
    )
  }

  return (
    <Card className="border border-zinc-200 shadow-sm rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-zinc-700 font-semibold">
            {title}
          </CardTitle>

          {select && (
            <Select onValueChange={onSelectChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {options.map(opt => (
                  <SelectItem key={opt.url} value={opt.url}>
                    {opt.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
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
