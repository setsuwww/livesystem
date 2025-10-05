"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
import { format } from "date-fns"
import { OfficesStatusBadge } from "./OfficesStatusBadge"
import { MapPin, AlarmClock } from "lucide-react"
import { officeStyles } from "@/constants/officeStyles"

export default function OfficesTable({ data, onEdit, onDelete, onToggleStatus, onBulkUpdate }) {
  const [allActive, setAllActive] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)

  const handleBulkToggle = () => {
    const newStatus = !allActive
    setPendingStatus(newStatus)
    setConfirmOpen(true)
  }

  const confirmBulkToggle = () => {
    setAllActive(pendingStatus)
    setConfirmOpen(false)
    // Logic: jika toggle ON → semua WFH jadi ACTIVE, semua WFO jadi INACTIVE
    onBulkUpdate?.({
      activateType: "WFH",
      deactivateType: "WFO",
      isActive: pendingStatus,
    })
  }

  return (
    <>
      <div className="space-y-3">
        {/* Bulk Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="bulk-toggle"
            checked={allActive}
            onCheckedChange={handleBulkToggle}
          />
          <Label htmlFor="bulk-toggle" className="text-sm text-slate-600">
            Set All WFH Active / WFO Inactive
          </Label>
        </div>

        {/* Table */}
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Created & Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((office) => (
                  <TableRow key={office.id}>
                    {/* Name + Location */}
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="group flex items-center space-x-2 cursor-pointer hover:bg-sky-50 transition p-1.5 rounded-md">
                            <div className="group-hover:bg-sky-100 bg-slate-200 group-hover:text-sky-600 text-slate-600 transition p-2 rounded-lg">
                              <MapPin strokeWidth={1} />
                            </div>
                            <div className="flex flex-col p-1 rounded-md">
                              <span className="text-sm text-slate-600 font-semibold">{office.name}</span>
                              <span className="text-xs text-slate-400">{office.location}</span>
                            </div>
                          </div>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto text-sm">
                          <div className="space-y-1">
                            <p>
                              <span className="font-medium text-slate-700">Latitude:</span>{" "}
                              <span className="text-slate-500">{office.latitude ?? "-"}</span>
                            </p>
                            <p>
                              <span className="font-medium text-slate-700">Longitude:</span>{" "}
                              <span className="text-slate-500">{office.longitude ?? "-"}</span>
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Badge variant="outline" className={officeStyles[office.type]}>
                        {office.type}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <OfficesStatusBadge
                        status={office.status}
                        onToggle={() => onToggleStatus?.(office)}
                      />
                    </TableCell>

                    {/* Work Hours */}
                    <TableCell>
                      <div className="text-slate-600 flex items-center space-x-2">
                        <AlarmClock strokeWidth={1.5} size={16} />
                        <span>
                          {office.startTime && office.endTime
                            ? `${office.startTime} - ${office.endTime}`
                            : "-"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Created & Updated */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-600 font-semibold">
                          {format(new Date(office.createdAt), "dd MMM yyyy")}
                        </span>
                        <span className="text-xs text-slate-400">
                          {format(new Date(office.updatedAt), "dd MMM yyyy")}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit?.(office)}
                          className="flex items-center gap-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete?.(office)}
                          className="flex items-center gap-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog Konfirmasi */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} >
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Activate</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            {pendingStatus
              ? "Are you sure want to activate all WFH (Work From Home) & inactivate all WFO (Work From Office)?"
              : "Are you sure want to activate all WFH & inactivate all WFO?"}
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={confirmBulkToggle}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
