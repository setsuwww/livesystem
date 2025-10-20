"use client"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/Table"
import { cn } from "@/lib/utils"
import { ArrowRightLeft, RefreshCcw } from "lucide-react"
import { capitalize } from "@/function/globalFunction"

export default function RequestsTable({ data = [], type }) {
  return (
    <div className="rounded-md overflow-hidden border border-slate-200">
      <Table>
        <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Shift Info</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <EmptyRow label={type} />
          ) : (
            data.map((req) => <RequestRow key={req.id} {...req} />)
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function EmptyRow({ label }) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="py-6 text-center text-slate-400 italic">
        No {label.toLowerCase()} requests found.
      </TableCell>
    </TableRow>
  )
}

function RequestRow({ id, type, requestedBy, user, info, reason, status, date }) {
  const Icon = type === "Shift Change" ? ArrowRightLeft : RefreshCcw
  const iconColor = type === "Shift Change" ? "text-sky-500" : "text-purple-500"

  return (
    <TableRow key={id} className="hover:bg-slate-50/70 transition-colors duration-150 ease-in-out">
      <TableCell>
        <div className={cn("inline-flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium",
          type === "Shift Change" ? "text-sky-600" : "text-purple-600"
        )}>
          <Icon className={cn("h-4 w-4", iconColor)} />
          {type}
        </div>
      </TableCell>

      <TableCell className="font-medium text-slate-800">{requestedBy}</TableCell>
      <TableCell className="text-slate-600">{user}</TableCell>
      <TableCell className="text-slate-600">{info}</TableCell>
      <TableCell className="text-slate-500 line-clamp-2 max-w-[220px]">{reason || "-"}</TableCell>

      <TableCell>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-slate-200">
          <span className={cn("h-2.5 w-2.5 rounded-full", statusDotColor(status))} />
          <span className="text-sm font-semibold text-slate-600">
            {capitalize(status.replace("_", " ").toLowerCase())}
          </span>
        </div>
      </TableCell>

      <TableCell className="text-right text-slate-400 text-sm whitespace-nowrap">{date}</TableCell>
    </TableRow>
  )
}

function statusDotColor(status) {
  switch (status) {
    case "PENDING":
    case "PENDING_TARGET":
    case "PENDING_ADMIN":
      return "bg-yellow-400"
    case "APPROVED":
      return "bg-teal-400"
    case "REJECTED":
      return "bg-rose-400"
    default:
      return "bg-slate-400"
  }
}
