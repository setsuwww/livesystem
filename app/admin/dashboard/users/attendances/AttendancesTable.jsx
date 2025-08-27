"use client"

import { capitalize } from '@/function/helpers/timeHelpers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { shiftStyles } from "@/constants/shiftStyles"
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AttendancesTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Shift</TableHead>
          <TableHead>Checkin</TableHead>
          <TableHead>Checkout</TableHead>
          <TableHead>Jam Kerja</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Alasan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((att) => (
          <TableRow key={att.id}>
            {/* Tanggal absen */}
            <TableCell>
              {format(new Date(att.date), "dd MMMM yyyy", { locale: id })}
            </TableCell>

            {/* User info */}
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm text-zinc-700 font-semibold">{att.user?.name}</span>
                <span className="text-xs text-zinc-400">{att.user?.email}</span>
              </div>
            </TableCell>

            {/* Shift type */}
            <TableCell>
              <span className={`px-2 py-0.5 rounded-md ${shiftStyles[att.shift?.type]} `}>
                {capitalize(att.shift?.type)}
              </span>
            </TableCell>

            {/* Checkin */}
            <TableCell>
              <span className="text-sm font-semibold text-green-500">
                {att.checkInTime
                  ? format(new Date(att.checkInTime), "HH:mm", { locale: id })
                  : "-"}
              </span>
            </TableCell>

            {/* Checkout */}
            <TableCell>
              <span className="text-sm font-semibold text-red-500">
                {att.checkOutTime
                  ? format(new Date(att.checkOutTime), "HH:mm", { locale: id })
                  : "-"}
              </span>
            </TableCell>

            {/* Jam kerja shift */}
            <TableCell>
              {att.shift
                ? `${format(new Date(att.shift.startTime), "HH:mm", { locale: id })} - ${format(new Date(att.shift.endTime), "HH:mm", { locale: id })}`
                : "-"}
            </TableCell>

            {/* Status */}
            <TableCell>
              <span
                className={
                  att.status === "PRESENT"
                    ? "text-green-600 bg-green-100 text-sm rounded-md px-3 py-0.5 font-base"
                    : att.status === "LATE"
                    ? "text-yellow-600 bg-yellow-100 text-sm rounded-md px-3 py-0.5 font-base"
                    : att.status === "PERMISSION"
                    ? "text-blue-600 bg-blue-100 text-sm rounded-md px-3 py-0.5 font-base"
                    : "text-red-600 bg-red-100 text-sm rounded-md px-3 py-0.5 font-base"
                }
              >
                {capitalize(att.status)}
              </span>
            </TableCell>

            {/* Alasan izin */}
            <TableCell>{att.reason ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
