"use client"

import { Badge } from "@/components/ui/Badge"
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
                {format(new Date(h.date), "dd MMMM yyyy", { locale: id })}
              </TableCell>
              <TableCell>
                <Badge className={shiftStyles[h.shift?.type] ?? "bg-zinc-100 text-zinc-700"}>
                  {capitalize(h.shift?.type) ?? "-"}
                </Badge>
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
