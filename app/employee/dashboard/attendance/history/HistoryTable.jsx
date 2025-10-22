"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_components/ui/Table"
import { Badge } from "@/_components/ui/Badge"
import { Button } from "@/_components/ui/Button"
import { ArrowUpDown, CalendarDays } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { attedancesStyles } from "@/_constants/attedanceConstants"
import { shiftStyles } from "@/_constants/shiftConstants"
import { capitalize } from "@/_function/globalFunction"

export default function HistoryTable({ data, initialOrder }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState(initialOrder)

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) =>
      order === "asc"
        ? new Date(a.datePart) - new Date(b.datePart)
        : new Date(b.datePart) - new Date(a.datePart)
    )
  }, [data, order])

  const toggleOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc"
    setOrder(newOrder)
    const params = new URLSearchParams(searchParams)
    params.set("order", newOrder)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-2">
      {/* Header Action */}
      <div className="flex justify-start">
        <Button variant="outline" size="sm" onClick={toggleOrder} className="flex items-center gap-2 text-slate-600">
          <ArrowUpDown className="w-4 h-4 text-yellow-500" />
          {order === "asc" ? "Oldest First" : "Newest First"}
        </Button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((att) => (
                <TableRow
                  key={att.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Date */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-full">
                        <CalendarDays
                          className="h-5 w-5 text-slate-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {att.date}
                        </p>
                        <p className="text-xs text-slate-400">{att.datePart}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Shift */}
                  <TableCell>
                    <Badge
                      className={`border-none px-4 py-1 ${shiftStyles[att.shift?.toUpperCase()]} text-xs`}
                    >
                      {capitalize(att.shift)}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className={`border-none px-4 py-1 ${attedancesStyles[capitalize(att.status)]} text-xs`}>
                      {capitalize(att.status)}
                    </Badge>
                  </TableCell>

                  {/* Reason + Admin Note */}
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="text-sm text-slate-700">
                        {att.reason || "—"}
                      </p>
                      {att.adminNote && (
                        <p className="text-xs text-slate-400">
                          Note: {att.adminNote}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="text-xs text-slate-500">
                    {new Date(att.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
