"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MapPin, AlarmClock, Radar, Locate, LocateFixed } from "lucide-react"
import { officeStyles } from "@/constants/officeStyles"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"

import { useOfficesHooks } from "@/function/hooks/useOfficesHooks"
import { OfficesStatusBadge } from "./OfficesStatusBadge"
import { OfficesActionHeader } from "./OfficesActionHeader"
import { handleOffices } from "@/function/handleOffices"

export default function OfficesTable({ data }) {
  const {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filteredData,
    selectedIds,
    handleDeleteSelected,
    handleDeleteAll,
    handleExportPDF,
    searchRef,
  } = useOfficesHooks(data)

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
    handleOffices.onBulkUpdate({
      activateType: "WFA",
      deactivateType: "WFO",
      isActive: pendingStatus,
    })
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Switch id="bulk-toggle" checked={allActive} onCheckedChange={handleBulkToggle} />
          <Label htmlFor="bulk-toggle" className="text-sm text-slate-600">
            Set All WFA Active / WFO Inactive
          </Label>
        </div>

        <OfficesActionHeader
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedCount={selectedIds.length}
          onDeleteSelected={handleDeleteSelected}
          onDeleteAll={handleDeleteAll}
          onExportPDF={handleExportPDF}
          filteredData={filteredData}
          searchInputRef={searchRef}
        />

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
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((office) => (
                  <TableRow key={office.id}>
                    {/* Name + Location */}
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="group flex items-center space-x-2 cursor-pointer hover:bg-slate-50 border-transparent border hover:border-dashed hover:border-slate-200 transition p-1.5 rounded-md">
                            <div className="group-hover:bg-slate-300 bg-slate-200 group-hover:text-slate-700 text-slate-600 transition p-2 rounded-full">
                              <MapPin strokeWidth={1} />
                            </div>
                            <div className="flex flex-col p-1 rounded-md">
                              <span className="text-sm text-slate-600 group-hover:text-slate-700 font-semibold">{office.name}</span>
                              <span className="text-xs text-slate-400 group-hover:text-slate-500 ">{office.location}</span>
                            </div>
                          </div>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto text-sm">
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-600 mb-2">Coordinate</h4>
                            <p className="flex items-center space-x-1">
                              <Radar size={20} strokeWidth={1.5} className="text-sky-600" />
                              <span className="font-medium text-slate-700">Radius:</span>{" "}
                              <span className="text-slate-500">{office.radius ?? "-"}</span>
                            </p>
                            <p className="flex items-center space-x-1">
                              <Locate size={20} strokeWidth={1.5} className="text-sky-600" />
                              <span className="font-medium text-slate-700">Latitude:</span>{" "}
                              <span className="text-slate-500">{office.latitude ?? "-"}</span>
                            </p>
                            <p className="flex items-center space-x-1">
                              <LocateFixed size={20} strokeWidth={1.5} className="text-sky-600" />
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
                      <OfficesStatusBadge status={office.status} onToggle={() => handleOffices.onToggleStatus(office)} />
                    </TableCell>

                    {/* Work Hours */}
                    <TableCell>
                      <div className="text-slate-600 flex items-center space-x-2">
                        <AlarmClock strokeWidth={1.5} size={16} />
                        <span>
                          {office.startTime && office.endTime ? `${office.startTime} - ${office.endTime}` : "-"}
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
                        <Button size="sm" variant="outline" onClick={() => handleOffices.onEdit(office)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleOffices.onDelete(office)}>
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
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Activate</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            {pendingStatus
              ? "Are you sure want to activate all WFA (Work From Home) & inactivate all WFO (Work From Office)?"
              : "Are you sure want to activate all WFA & inactivate all WFO?"}
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
