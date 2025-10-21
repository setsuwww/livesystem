"use client"

import { useTransition, useState } from "react"
import { updateShiftChangeStatus } from "@/_components/server/attendanceAction"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/_components/ui/Table"
import { Button } from "@/_components/ui/Button"
import { ArrowRightLeft, CircleUserRound } from "lucide-react"
import { cn } from "@/_lib/utils"
import { capitalize } from '@/_function/globalFunction';

export default function ChangeShiftTable({ requests = [], currentUserId }) {
  const [isPending, startTransition] = useTransition()
  const [rows, setRows] = useState(requests)

  // handle acc / reject dari target user
  const handleAction = (id, action) => {
    startTransition(async () => {
      await updateShiftChangeStatus(id, action, "TARGET")
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: action === "ACCEPT" ? "PENDING_ADMIN" : "REJECTED" } : r
        )
      )
    })
  }

  const filtered = rows.filter(
    (r) => r.targetUserId === currentUserId && r.status === "PENDING_TARGET"
  )

  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Requester</TableHead>
            <TableHead>Old Shift</TableHead>
            <TableHead>Requested Shift</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-slate-400 italic">
                No incoming shift change requests.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((req) => (
              <TableRow
                key={req.id}
                className="hover:bg-slate-50 transition-colors duration-150"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-200 p-2 rounded-full">
            <CircleUserRound className="h-5 w-5 text-slate-600" strokeWidth={1} />
          </div>
                    <div>
                      <div className="font-medium text-slate-800">
                        {req.user?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-slate-500">{req.user?.email}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-slate-600">
                  {req.oldShift?.name || "-"}
                </TableCell>

                <TableCell className="text-sm text-slate-600">
                  {req.newShift?.name || "-"}
                </TableCell>

                <TableCell className="max-w-[240px] text-sm text-slate-500">
                  {req.reason || "-"}
                </TableCell>

                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold",
                      req.status === "PENDING_TARGET"
                        ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        : req.status === "REJECTED"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-teal-50 text-teal-700 border border-teal-200"
                    )}
                  >
                    {capitalize(req.status.replace("_", " "))}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handleAction(req.id, "ACCEPT")}
                      className="text-teal-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-100"
                    >
                      Accept
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handleAction(req.id, "REJECT")}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100"
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
