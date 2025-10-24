"use client"

import { memo } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/_components/ui/Alert-dialog"
import { Textarea } from "@/_components/ui/Textarea"
import { Ban, Loader2 } from "lucide-react"

function RequestRejectedAlert({
  open, onOpenChange,
  rejectReason, setRejectReason,
  isLoading,
  onConfirmReject,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-rose-50 text-rose-700 rounded-full border border-red-100">
                <Ban size={24} />
              </div>
              <span>Reject Request</span>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for rejecting this request.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Textarea placeholder="Type the reason for rejection..."
          value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
          className="min-h-[100px]"
        />

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
              onOpenChange(false)
              setRejectReason("")
            }}
          >
            Cancel
          </AlertDialogCancel> 

          <AlertDialogAction onClick={onConfirmReject} disabled={!rejectReason.trim() || isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default memo(RequestRejectedAlert)
