"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { TableRow, TableCell } from "@/_components/ui/Table"
import { Badge } from "@/_components/ui/Badge"
import { CircleUserRound } from "lucide-react"
import { toast } from "sonner"

import { shiftStyles } from "@/_constants/shiftConstants"
import RequestStatusChangerToggle from "./RequestStatusChangerToggle"
import RequestRejectedAlert from "./RequestRejectedAlert"
import { updateRequestStatus, updatePermissionStatus } from "@/_components/server/shiftAction"

export default function RequestsTableRow({
  id, type, requestedBy, user, 
  oldShift, targetShift, info,
  reason, status, date,
  requestType, typeShift,
}) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(status)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const extractId = (fullId) => {
    const clean = fullId?.replace(/^(shift-|perm-)/, "");
    return clean && !isNaN(clean) ? Number(clean) : null;
  };

  const actualId = useMemo(
    () => id?.replace(/^(shift-|perm-)/, "") || "",
    [id]
  )

  const handleStatusChange = useCallback(
    async (newStatus, reason = null) => {
      setIsLoading(true)
      try { let res
        if (requestType === "shift") {
          res = await updateRequestStatus(Number(actualId), newStatus, reason)
        } else if (requestType === "permission") {
          res = await updatePermissionStatus(Number(actualId), newStatus, reason)
        }

        if (res?.success) {
          setCurrentStatus(newStatus)
          toast.success(`Request ${newStatus.toLowerCase()} successfully`)
          router.refresh()
        } else {
          toast.error(res?.message || "Failed to update request")
        }
      } catch (err) {
        console.error(err)
        toast.error("An error occurred while updating the request")
      } finally {
        setIsLoading(false)
      }
    },
    [actualId, router, requestType]
  )


  const handleReject = useCallback(() => {
    if (!rejectReason.trim()) return
    handleStatusChange("REJECTED", rejectReason)
    setShowRejectDialog(false)
    setRejectReason("")
  }, [rejectReason, handleStatusChange])

  const renderUserInfo = useCallback(
    (person) =>
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
      ),
    []
  )

  const renderShiftInfo = useMemo(() => {
    if (requestType !== "shift") {
      return (
        <Badge
          className={`border-none px-3 py-1 ${
            type === "Permission"
              ? shiftStyles[typeShift]
              : "bg-slate-50 text-sky-600"
          }`}
        >
          {info}
        </Badge>
      )
    }

    return (
      <div className="flex flex-col items-start justify-start gap-1 text-left">
        <div className="flex items-center space-x-1">
          <span className="font-semibold px-2 py-0.5 text-sky-500 border border-slate-200 shadow-xs rounded-md">From :</span>
          <Badge
            className={`border-none px-3 py-1 text-xs font-medium ${
              shiftStyles[oldShift?.type] || "bg-slate-100 text-slate-700"
            }`}
          >
            {oldShift?.name || "-"}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold px-2 py-0.5 text-sky-500 border border-slate-200 shadow-xs rounded-md">To :</span>
          <Badge
            className={`border-none px-3 py-1 text-xs font-medium ${
              shiftStyles[targetShift?.type] || "bg-slate-100 text-slate-700"
            }`}
          >
            {targetShift?.name || "-"}
          </Badge>
        </div>
      </div>
    )
  }, [requestType, type, typeShift, info, oldShift, targetShift])

  return (
    <>
      <TableRow>
        <TableCell>{renderUserInfo(requestedBy)}</TableCell>
        {requestType === "shift" && <TableCell>{renderUserInfo(user)}</TableCell>}
        <TableCell className="max-w-xs">{renderShiftInfo}</TableCell>
        <TableCell className="max-w-2xs">
          <span className="line-clamp-2 text-sm text-muted-foreground">
            {reason || "-"}
          </span>
        </TableCell>
        <TableCell>
          <RequestStatusChangerToggle status={currentStatus} requestId={actualId} disabled={isLoading}
            onReject={() => setShowRejectDialog(true)} onStatusChange={(newStatus) => handleStatusChange(newStatus)}
          />
        </TableCell>
        <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
          {date}
        </TableCell>
      </TableRow>

      <RequestRejectedAlert
        open={showRejectDialog} onOpenChange={setShowRejectDialog}
        rejectReason={rejectReason} setRejectReason={setRejectReason}
        isLoading={isLoading} onConfirmReject={handleReject}
      />
    </>
  )
}
