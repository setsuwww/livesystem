"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from '@/components/ui/Badge';
import { shiftStyles } from "@/constants/shiftConstants"
import { attedancesStyles } from '@/constants/attedanceConstants';
import { safeFormat, capitalize } from "@/function/globalFunction";

export default function AttendancesTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Shift</TableHead>
          <TableHead>Check In & Out</TableHead>
          <TableHead>Total Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((att) => (
          <TableRow key={att.id}>
            <TableCell>{safeFormat(att.date, "dd MMMM yyyy")}</TableCell>

            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm text-slate-700 font-semibold">{att.user?.name}</span>
                <span className="text-xs text-slate-400">{att.user?.email}</span>
              </div>
            </TableCell>

            <TableCell>
              {att.shift ? (
                <Badge className={`px-2 py-0.5 rounded-md border-none ${shiftStyles[att.shift.type] ?? 'bg-gray-100 text-gray-700'}`}>
                  {capitalize(att.shift.name)}
                </Badge>
              ) : (
                <span className="text-sm text-gray-400">-</span>
              )}
            </TableCell>

            <TableCell>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-teal-500">{safeFormat(att.checkInTime, "HH:mm")}</span>
                <span className="text-sm text-rose-500">{safeFormat(att.checkOutTime, "HH:mm")}</span>
              </div>
            </TableCell>

            <TableCell>{att.shift ? `${att.shift.startTime} - ${att.shift.endTime}` : "-"}</TableCell>

            <TableCell>
              <Badge className={`border-none ${attedancesStyles[capitalize(att.status)]}`}>
                {capitalize(att.status)}
              </Badge>
            </TableCell>

            <TableCell>{att.reason ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
