"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from '@/components/ui/Badge';

import { shiftStyles } from "@/constants/shiftStyles"
import { attedancesStyles } from '@/constants/attedancesStyles';

import { safeFormat, capitalize } from "@/function/globalFunction";

export default function AttendancesTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Shift</TableHead>
          <TableHead>Checkin</TableHead>
          <TableHead>Checkout</TableHead>
          <TableHead>Office hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((att) => (
          <TableRow key={att.id}>
            <TableCell>
<<<<<<< HEAD
              {safeFormatDate(att.date, "dd MMMM yyyy")}
=======
              {safeFormat(att.date, "dd MMMM yyyy")}
>>>>>>> 4370506050f620c9ebf3276e9ee9229098b88c4e
            </TableCell>

            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm text-zinc-700 font-semibold">{att.user?.name}</span>
                <span className="text-xs text-zinc-400">{att.user?.email}</span>
              </div>
            </TableCell>

            <TableCell>
              <Badge className={`px-2 py-0.5 rounded-md ${shiftStyles[att.shift?.type]} `}>
                {capitalize(att.shift?.type)}
              </Badge>
            </TableCell>

            <TableCell>
              <span className="text-sm text-green-500">
<<<<<<< HEAD
                {safeFormatDate(att.checkInTime, "HH:mm")}
=======
                {safeFormat(att.checkInTime, "HH:mm")}
>>>>>>> 4370506050f620c9ebf3276e9ee9229098b88c4e
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm text-red-500">
<<<<<<< HEAD
                {safeFormatDate(att.checkOutTime, "HH:mm")}
=======
                {safeFormat(att.checkOutTime, "HH:mm")}
>>>>>>> 4370506050f620c9ebf3276e9ee9229098b88c4e
              </span>
            </TableCell>

            <TableCell>
              {att.shift ? `${att.shift.startTime} - ${att.shift.endTime}` : "-"}
            </TableCell>

            <TableCell>
              <Badge className={attedancesStyles[capitalize(att.status)]}>
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
