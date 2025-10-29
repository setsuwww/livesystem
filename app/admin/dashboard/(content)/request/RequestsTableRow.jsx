"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { TableRow, TableCell } from "@/_components/ui/Table"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/_components/ui/Dialog"
import { Badge } from "@/_components/ui/Badge"
import { CircleUserRound } from "lucide-react"
import { toast } from "sonner"

import { shiftStyles } from "@/_constants/shiftConstants"
import RequestStatusChangerToggle from "./RequestStatusChangerToggle"
import RequestRejectedAlert from "./RequestRejectedAlert"
import { capitalize } from '@/_function/globalFunction';
import { updateShiftChangeRequestStatus, updatePermissionStatus } from "@/_components/server/shiftAction"

export default function RequestsTableRow({
  id, type, requestedBy, user,
  oldShift, targetShift,
  info, reason, status,
  date, startDate, endDate,   
  requestType, typeShift,
}) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(status)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const actualId = useMemo(() => {
    const clean = id?.replace(/^(shift-|perm-)/, "")
    return clean && !isNaN(clean) ? Number(clean) : null
  }, [id])

  const handleStatusChange = useCallback(
    async (newStatus, reason = null) => {
      if (!actualId) return
      setIsLoading(true)
      try {
        const res =
          requestType === "shift"
            ? await updateShiftChangeRequestStatus(actualId, newStatus, reason)
            : await updatePermissionStatus(actualId, newStatus, reason)

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
        <div className="flex items-start gap-2">
          <div className="bg-slate-200 p-2 rounded-full">
            <CircleUserRound className="h-5 w-5 text-slate-600" strokeWidth={1} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600">{person.name}</p>
            <p className="text-xs text-slate-400">{person.email}</p>
            {person.division?.name && (
              <p className="text-xs font-medium text-indigo-500">
                {person.division.name}
              </p>
            )}
          </div>
        </div>
      ) : (
        "-"
      ),
    []
  )

  const renderShiftInfo = useMemo(() => {
    if (requestType === "permission") {
      return (
        <Badge
          className={`border-none px-3 py-1 text-xs font-medium ${
            shiftStyles[typeShift] || "bg-slate-100 text-slate-600"
          }`}
        >
          {capitalize(info)}
        </Badge>
      )
    }

    return (
      <div className="flex flex-col items-start justify-start gap-1 text-left">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-teal-400">
            From :
          </span>
          <Badge
            className={`border-none px-3 py-1 text-xs font-medium ${
              shiftStyles[oldShift?.type] || "bg-slate-100 text-slate-700"
            }`}
          >
            {oldShift?.name || "-"}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-rose-400">
            To :
          </span>
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
  }, [requestType, typeShift, info, oldShift, targetShift])

  return (
    <>
      <TableRow>
        <TableCell>{renderUserInfo(requestedBy)}</TableCell>

        {requestType === "shift" && <TableCell>{renderUserInfo(user)}</TableCell>}

        <TableCell className="max-w-xs">{renderShiftInfo}</TableCell>

        <TableCell className="max-w-[120px]">
          {reason ? (
            <Dialog>
              <DialogTrigger asChild>
                <div className="text-left">
                  <p className="line-clamp-3 text-sm text-slate-400 cursor-pointer">
                    {reason}
                  </p>
                  <span className="text-xs text-sky-500 hover:underline cursor-pointer">
                    Read more
                  </span>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Reason detail</DialogTitle>
                  <DialogDescription asChild>
                    <p className="whitespace-pre-wrap text-slate-600 mt-2">
                      {reason}
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-sm text-slate-400">-</span>
          )}
        </TableCell>

        <TableCell>
          <RequestStatusChangerToggle
            status={currentStatus}
            requestId={actualId}
            disabled={isLoading}
            onReject={() => setShowRejectDialog(true)}
            onStatusChange={(newStatus) => handleStatusChange(newStatus)}
          />
        </TableCell>

        {/* ✅ Menampilkan tanggal sesuai tipe request */}
        <TableCell className="text-slate-400 whitespace-nowrap text-sm">
          {requestType === "shift" ? (
            <div>
              <p className="text-teal-500">{startDate || "-"}</p>
              <p className="text-rose-500">{endDate || "-"}</p>
            </div>
          ) : (
            date || "-"
          )}
        </TableCell>
      </TableRow>

      <RequestRejectedAlert
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isLoading={isLoading}
        onConfirmReject={handleReject}
      />
    </>
  )
}
