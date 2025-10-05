"use client"

import { Badge } from "@/components/ui/Badge"
import { Checkbox } from "@/components/ui/Checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { attedancesStyles } from "@/constants/attedancesStyles"
import { shiftStyles } from "@/constants/shiftStyles"

import { capitalize } from "@/function/globalFunction";
import { format } from "date-fns"
import { id } from "date-fns/locale"

export default function UserHistoryTable({ history }) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">
              <Checkbox />
            </TableHead>
            <TableHead className="text-left">Tanggal</TableHead>
            <TableHead className="text-left">Shift</TableHead>
            <TableHead className="text-left">Check In</TableHead>
            <TableHead className="text-left">Check Out</TableHead>
            <TableHead className="text-left">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((h) => (
            <TableRow key={h.id} className="text-left">
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                {format(new Date(h.date), "dd MMMM yyyy", { locale: id })}
              </TableCell>
              <TableCell>
                <span className="flex flex-col items-start">
                  <span className={`!bg-transparent text-sm font-semibold ${shiftStyles[h.shift?.type] ?? "text-slate-700"}`}>
                    {capitalize(h.shift?.type) ?? "-"}
                  </span>
                  <div className="flex items-center gap-x-2 text-xs text-slate-400">
                    <span>{h.shift?.startTime ?? "-"}</span>
                    <span>-</span>
                    <span>{h.shift?.endTime ?? "-"}</span>
                  </div>
                </span>
              </TableCell>
              <TableCell>
                {h.checkInTime
                  ? new Date(h.checkInTime).toLocaleTimeString()
                  : "-"}
              </TableCell>
              <TableCell>
                {h.checkOutTime
                  ? new Date(h.checkOutTime).toLocaleTimeString()
                  : "-"}
              </TableCell>
              <TableCell>
                <Badge className={attedancesStyles[capitalize(h.status)]}>
                  {capitalize(h.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
