"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_components/ui/Table"
import { Badge } from "@/_components/ui/Badge"
import { Button } from "@/_components/ui/Button"
import { ArrowUpDown, ArrowDownUp, CalendarDays } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { attedancesStyles } from "@/_constants/attendanceConstants"
import { shiftStyles } from "@/_constants/shiftConstants"
import { capitalize, safeFormat } from "@/_function/globalFunction"

export default function HistoryTable({ data, initialOrder }) {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState(initialOrder)

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => order === "asc"
      ? new Date(a.datePart) - new Date(b.datePart)
        : new Date(b.datePart) - new Date(a.datePart)
    )
  }, [data, order])

  const toggleOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc"
    setOrder(newOrder)
    const params = new URLSearchParams(searchParams)
    params.set("order", newOrder)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-start mb-4">
        <Button variant="outline" size="sm" onClick={toggleOrder} className="flex items-center gap-2">
          {order === "asc" ? (
            <>
              <ArrowUpDown className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-slate-600">Sort by :</span>
              <span className="text-slate-400">Oldest</span>
            </>
          ) : (
            <>
              <ArrowDownUp className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-slate-600">Sort by :</span>
              <span className="text-slate-400">Newest</span>
            </>
          )}
        </Button>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Checkin & Out time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((att) => (
                <TableRow key={att.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-200 p-2 rounded-full">
                        <CalendarDays className="h-5 w-5 text-slate-600" strokeWidth={1.5}/>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {att.date}
                        </p>
                        <p className="text-xs text-slate-400">{att.datePart}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={`border-none px-3 py-1 ${shiftStyles[att.shift]} text-sm`}>
                      {capitalize(att.shift)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge className={`border-none px-3 py-1 ${attedancesStyles[capitalize(att.status)]} text-sm`}>
                      {capitalize(att.status)}
                    </Badge>
                  </TableCell>

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

                  <TableCell className="text-sm font-semibold">
                    <div className="flex flex-col">
                      <span className="text-teal-600">Checkin at: {safeFormat(att.checkInTime, "HH:mm")}</span> 
                      <span className="text-rose-600">Checkout at: {safeFormat(att.checkOutTime, "HH:mm")}</span>
                    </div>
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
