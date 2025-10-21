"use client"

import { useState } from "react"
import { TableRow, TableCell } from "@/_components/ui/Table"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/_components/ui/Select"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/_components/ui/Alert-dialog"
import { Textarea } from "@/_components/ui/Textarea"
import { Badge } from "@/_components/ui/Badge"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function RequestsTableRow({ id, type, requestedBy, user, info, reason, status, date, requestType }) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(status)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const extractId = (fullId) => {
    if (!fullId) return ""
    return fullId.replace(/^(shift-|perm-)/, "")
  }

  const actualId = extractId(id)

  const handleStatusChange = async (newStatus, adminReason = null) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/requests/${actualId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason: adminReason,
          type: requestType,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setCurrentStatus(newStatus)
        toast.success(`Request ${newStatus.toLowerCase()} successfully`)
        router.refresh()
      } else {
        toast.error(result.message || "Failed to update request")
      }
    } catch (error) {
      console.error("Error updating request:", error)
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

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "warning",
      ACCEPTED: "success",
      REJECTED: "destructive",
    }

    return (
      <Badge variant={variants[status] || "default"} className="capitalize">
        {status.toLowerCase()}
      </Badge>
    )
  }

  return (
    <>
      <TableRow className="hover:bg-muted/50 transition-colors">
        <TableCell className="font-medium">{type}</TableCell>
        <TableCell>{requestedBy}</TableCell>
        {requestType === "shift" && <TableCell>{user}</TableCell>}
        <TableCell className="max-w-xs truncate">{info}</TableCell>
        <TableCell className="max-w-xs">
          <span className="line-clamp-2 text-sm text-muted-foreground">
            {reason || "-"}
          </span>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            <Select
              value={currentStatus}
              onValueChange={(val) => {
                if (val === "REJECTED") {
                  setShowRejectDialog(true)
                } else if (val !== currentStatus) {
                  handleStatusChange(val)
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Accept</SelectItem>
                <SelectItem value="REJECTED">Reject</SelectItem>
              </SelectContent>
            </Select>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </TableCell>

        <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
          {date}
        </TableCell>
      </TableRow>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this request. This will be visible to the
              user.
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