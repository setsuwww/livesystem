"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from '@/components/ui/Badge';
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { shiftStyles } from "@/constants/shiftStyles"
import { attedancesStyles } from '@/constants/attedancesStyles';

import { capitalize } from '@/function/helpers/timeHelpers';

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
              {format(new Date(att.date), "dd MMMM yyyy", { locale: id })}
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
                {att.checkInTime ? format(new Date(att.checkInTime), "HH:mm", { locale: id })
                  : "-"}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm text-red-500">
                {att.checkOutTime ? format(new Date(att.checkOutTime), "HH:mm", { locale: id })
                  : "-"}
              </span>
            </TableCell>

            <TableCell>
              {att.shift ? `${format(new Date(att.shift.startTime), "HH:mm", { locale: id })} - ${format(new Date(att.shift.endTime), "HH:mm", { locale: id })}`
                : "-"}
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
