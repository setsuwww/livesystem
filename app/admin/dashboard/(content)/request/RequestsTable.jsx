"use client"

import { useState } from "react"
import { TableRow, TableCell } from "@/_components/ui/Table"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/_components/ui/Select"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/_components/ui/Alert-dialog"
import { Textarea } from "@/_components/ui/Textarea"
import { Button } from "@/_components/ui/Button"
import { cn } from "@/_lib/utils"
import { updatePermissionStatus } from "@/_components/server/attendanceAction"

export default function RequestTable({ id, type, requestedBy, user, info, reason, status, date }) {
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // form action async server handler
  const handleFormAction = async (formData) => {
    const id = formData.get("id")
    const newStatus = formData.get("status")
    const reason = formData.get("reason") || null
    await updatePermissionStatus(id, newStatus, reason)
  }

  return (
    <>
      <form action={handleFormAction}>
        <input type="hidden" name="id" value={id.replace("perm-", "")} />

        <TableRow className="hover:bg-slate-50/70 transition-colors">
          <TableCell>{type}</TableCell>
          <TableCell>{requestedBy}</TableCell>
          <TableCell>{user}</TableCell>
          <TableCell>{info}</TableCell>
          <TableCell>{reason || "-"}</TableCell>

          <TableCell>
            <Select
              name="status"
              defaultValue={status}
              onValueChange={(val) => {
                if (val === "REJECTED") setShowRejectDialog(true)
              }}
            >
              <SelectTrigger
                className={cn(
                  "w-[130px] text-xs font-semibold border px-2 py-1 transition rounded-md",
                  status === "PENDING"
                    ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                    : status === "ACCEPTED"
                    ? "border-teal-300 bg-teal-50 text-teal-700"
                    : "border-rose-300 bg-rose-50 text-rose-700"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="ghost" size="sm" className="mt-2 text-xs">
              Save
            </Button>
          </TableCell>

          <TableCell className="text-slate-400 text-sm whitespace-nowrap">{date}</TableCell>
        </TableRow>
      </form>

      {/* Reject reason dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Permission Request</AlertDialogTitle>
          </AlertDialogHeader>
          <form action={handleFormAction}>
            <input type="hidden" name="id" value={id?.replace?.("perm-", "") || ""} />
            <input type="hidden" name="status" value="REJECTED" />
            <Textarea
              name="reason"
              placeholder="Type the reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2"
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowRejectDialog(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={!rejectReason.trim()}
                onClick={() => setShowRejectDialog(false)}
              >
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
