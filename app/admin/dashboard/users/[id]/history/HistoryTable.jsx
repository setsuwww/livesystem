"use client"

import { Badge } from "@/components/ui/Badge"
<<<<<<< HEAD
=======
import { Checkbox } from "@/components/ui/Checkbox"
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
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
<<<<<<< HEAD
=======
            <TableHead className="text-left">
              <Checkbox />
            </TableHead>
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
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
<<<<<<< HEAD
                {format(new Date(h.date), "dd MMMM yyyy", { locale: id })}
              </TableCell>
              <TableCell>
                <Badge className={shiftStyles[h.shift?.type] ?? "bg-zinc-100 text-zinc-700"}>
                  {capitalize(h.shift?.type) ?? "-"}
                </Badge>
=======
                <Checkbox />
              </TableCell>
              <TableCell>
                {format(new Date(h.date), "dd MMMM yyyy", { locale: id })}
              </TableCell>
              <TableCell>
                <span className="flex flex-col items-start">
                  <span className={`!bg-transparent text-sm font-semibold ${shiftStyles[h.shift?.type] ?? "text-zinc-700"}`}>
                    {capitalize(h.shift?.type) ?? "-"}
                  </span>
                  <div className="flex items-center gap-x-2 text-xs text-zinc-400">
                    <span>{h.shift?.startTime ?? "-"}</span>
                    <span>-</span>
                    <span>{h.shift?.endTime ?? "-"}</span>
                  </div>
                </span>
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
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
