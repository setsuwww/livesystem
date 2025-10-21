"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_components/ui/Table"
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
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
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
    <div>
      <div className="flex justify-end p-3">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={toggleOrder}
        >
          <ArrowUpDown className="w-4 h-4" />
          {order === "asc" ? "Oldest First" : "Newest First"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData.map((att) => (
            <TableRow key={att.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-200 p-2 rounded-full">
                    <CalendarDays className="h-5 w-5 text-slate-600" strokeWidth={1} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-slate-600">{att.date}</p>
                    <p className="text-xs font-base text-slate-400">{att.datePart}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={shiftStyles[att.shift?.toUpperCase()]}>
                  {capitalize(att.shift)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={attedancesStyles[capitalize(att.status)]}>
                  {capitalize(att.status)}
                </Badge>
              </TableCell>
              <TableCell className="italic text-slate-600">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{att.reason}</p>
                  <p className="text-xs font-base text-slate-400">{att.adminNote}</p>
                </div>
              </TableCell>
              <TableCell className="text-xs text-slate-600">
                {new Date(att.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
