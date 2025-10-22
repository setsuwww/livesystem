"use client"

import { useState } from "react"
import { TableRow, TableCell } from "@/_components/ui/Table"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/_components/ui/Alert-dialog"
import { Textarea } from "@/_components/ui/Textarea"
import { Badge } from "@/_components/ui/Badge"
import { Loader2, CircleUserRound, ArrowDown, Ban } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { shiftStyles } from "@/_constants/shiftConstants"
import RequestStatusChangerToggle from "./RequestStatusChangerToggle"

export default function RequestsTableRow({
  id,
  type,
  requestedBy,
  user,
  oldShift,
  targetShift,
  info,
  reason,
  status,
  date,
  requestType,
  typeShift,
}) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(status)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const extractId = (fullId) => fullId?.replace(/^(shift-|perm-)/, "") || ""
  const actualId = extractId(id)

  const handleStatusChange = async (newStatus, adminReason = null) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/requests/${actualId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason: adminReason,
          type: requestType,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setCurrentStatus(newStatus)
        toast.success(`Request ${newStatus.toLowerCase()} successfully`)
        router.refresh()
      } else toast.error(result.message || "Failed to update request")
    } catch (err) {
      console.error(err)
      toast.error("An error occurred while updating the request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    handleStatusChange("REJECTED", rejectReason)
    setShowRejectDialog(false)
    setRejectReason("")
  }

  const renderUserInfo = (person) =>
    person ? (
      <div className="flex items-center gap-2">
        <div className="bg-slate-200 p-2 rounded-full">
          <CircleUserRound className="h-5 w-5 text-slate-600" strokeWidth={1} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-600">{person.name}</p>
          <p className="text-xs text-slate-400">{person.email}</p>
        </div>
      </div>
    ) : (
      "-"
    )

  const renderShiftInfo = () => {
    if (requestType !== "shift") {
      return (
        <Badge className={`border-none px-3 py-1 ${ type === "Permission"
            ? shiftStyles[typeShift] : "bg-slate-50 text-slate-600"
          }`}
        >
          {info}
        </Badge>
      )
    }

    return (
      <div className="flex flex-col items-start justify-start gap-1 text-left">
        <div className="flex items-center space-x-1">
        <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">From : {""} </span>
        <Badge className={`border-none px-3 py-1 text-xs font-medium ${shiftStyles[oldShift?.type] || "bg-slate-100 text-slate-700"}`}>
           {oldShift?.name || "-"}
        </Badge>
        </div>
        
        <div className="flex items-center space-x-1 ">
        <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">To : {""} </span>
        <Badge className={`border-none px-3 py-1 text-xs font-medium ${shiftStyles[targetShift?.type] || "bg-slate-100 text-slate-700"}`}>
          {targetShift?.name || "-"}
        </Badge>
        </div>
      </div>
    )
  }

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{type}</TableCell>

        <TableCell>
          {renderUserInfo(requestedBy)}
        </TableCell>

        {requestType === "shift" && <TableCell>{renderUserInfo(user)}</TableCell>}

        <TableCell className="max-w-xs text-left">
          {renderShiftInfo()}
        </TableCell>

        <TableCell className="max-w-xs">
          <span className="line-clamp-2 text-sm text-muted-foreground">
            {reason || "-"}
          </span>
        </TableCell>

        <TableCell>
          <RequestStatusChangerToggle
            status={currentStatus}
            disabled={isLoading}
            onChange={(newStatus) => {
              if (newStatus === "REJECTED") setShowRejectDialog(true)
              else handleStatusChange(newStatus)
            }}
          />
        </TableCell>

        <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
          {date}
        </TableCell>
      </TableRow>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-50 text-rose-700 rounded-full border border-red-100">
                  <Ban size={24}/>
                </div>
                <span>Reject Request</span> 
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this request.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Textarea
            placeholder="Type the reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowRejectDialog(false)
                setRejectReason("")
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason.trim() || isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
