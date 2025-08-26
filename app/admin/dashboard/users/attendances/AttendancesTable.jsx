"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

export default function AttendancesTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Shift</TableHead>
          <TableHead>Jam Kerja</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Alasan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((att) => (
          <TableRow key={att.id}>
            <TableCell>{new Date(att.date).toLocaleDateString("id-ID")}</TableCell>
            <TableCell>{att.user?.name}</TableCell>
            <TableCell>{att.shift?.type}</TableCell>
            <TableCell>
              {new Date(att.shift?.startTime).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(att.shift?.endTime).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TableCell>
            <TableCell>
              <span
                className={
                  att.status === "PRESENT"
                    ? "text-green-600 font-medium"
                    : att.status === "LATE"
                    ? "text-yellow-600 font-medium"
                    : att.status === "PERMISSION"
                    ? "text-blue-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {att.status}
              </span>
            </TableCell>
            <TableCell>{att.reason ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
