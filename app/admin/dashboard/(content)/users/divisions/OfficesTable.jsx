"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { MapPin, AlarmClock, Radar, Locate, LocateFixed } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_components/ui/Table"
import { Badge } from "@/_components/ui/Badge"
import { Button } from "@/_components/ui/Button"
import { Switch } from "@/_components/ui/Switch"
import { Label } from "@/_components/ui/Label"
import { Popover, PopoverContent, PopoverTrigger } from "@/_components/ui/Popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/_components/ui/Dialog"

import { divisionStyles } from "@/_constants/divisionStyles"
import { DivisionsStatusBadge } from "./DivisionsStatusBadge"
import { DivisionsActionHeader } from "./DivisionsActionHeader"
import { useDivisionsHooks } from "@/_function/hooks/useDivisionsHooks"
import { handleDivisions } from "@/_function/handlers/handleDivisions"
import { minutesToTime } from "@/_function/globalFunction"

export default function DivisionsTable({ data }) {
  const {
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    filteredData,
    selectedIds,
    handleDeleteSelected, handleDeleteAll,
    handleExportPDF,
    searchRef, mutate
  } = useDivisionsHooks(data)

  const [allActive, setAllActive] = useState(false)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)

  useEffect(() => {
    async function fetchConfig() {
      try { const res = await fetch("/api/system-config")
        const data = await res.json()
        setAllActive(data.allWfaActive)
      } 
      catch (err) {console.error("❌ Failed to fetch config:", err)} 
      finally {setLoadingConfig(false)}
    }
    fetchConfig()
  }, [])

  const handleBulkToggle = () => {
    const newStatus = !allActive
    setPendingStatus(newStatus)
    setConfirmOpen(true)
  }

  const confirmBulkToggle = async () => {
    setAllActive(pendingStatus)
    setConfirmOpen(false)

    try {
      await fetch("/api/system-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allWfaActive: pendingStatus }),
      })

      await handleDivisions.onBulkUpdate({
        activateType: "WFA",
        deactivateType: "WFO",
        isActive: pendingStatus,
      })

      mutate && mutate()
      window.location.reload()
    } 
    catch (err) { console.error("❌ Error confirming bulk toggle:", err)}
  }

  if (loadingConfig) {
    return <p className="text-sm text-slate-500">Loading configuration...</p>
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

        <DivisionsActionHeader
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
                  <TableCell colSpan={6} className="text-center text-slate-400">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((division) => (
                  <TableRow key={division.id}>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="group flex items-center space-x-2 cursor-pointer hover:bg-slate-50 border-transparent border hover:border-dashed hover:border-slate-200 transition p-1.5 rounded-md">
                            <div className="group-hover:bg-slate-300 bg-slate-200 group-hover:text-slate-700 text-slate-600 transition p-2 rounded-full">
                              <MapPin strokeWidth={1} />
                            </div>
                            <div className="flex flex-col p-1 rounded-md">
                              <span className="text-sm text-slate-600 group-hover:text-slate-700 font-semibold">{division.name}</span>
                              <span className="text-xs text-slate-400 group-hover:text-slate-500 ">{division.location}</span>
                            </div>
                          </div>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto text-sm">
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-600 mb-2">Coordinate</h4>
                            <p className="flex items-center space-x-1">
                              <Radar size={20} strokeWidth={1.5} className="text-sky-600" />
                              <span className="font-medium text-slate-700">Radius:</span>{" "}
                              <span className="text-slate-500">{division.radius ?? "-"}</span>
                            </p>
                            <p className="flex items-center space-x-1">
                              <Locate size={20} strokeWidth={1.5} className="text-sky-600" />
                              <span className="font-medium text-slate-700">Latitude:</span>{" "}
                              <span className="text-slate-500">{division.latitude ?? "-"}</span>
                            </p>
                            <p className="flex items-center space-x-1">
                              <LocateFixed size={20} strokeWidth={1.5} className="text-sky-600" />
                              <span className="font-medium text-slate-700">Longitude:</span>{" "}
                              <span className="text-slate-500">{division.longitude ?? "-"}</span>
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={divisionStyles[division.type]}>
                        {division.type}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <DivisionsStatusBadge status={division.status} onToggle={() => handleDivisions.onToggleStatus(division, mutate)} />
                    </TableCell>

                    <TableCell>
                      <div className="text-slate-600 flex items-center space-x-2">
                        <AlarmClock strokeWidth={1.5} size={16} />
                        <span>
                          {division.startTime != null && division.endTime != null
                            ? `${minutesToTime(division.startTime)} - ${minutesToTime(division.endTime)}`
                            : "-"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-600 font-semibold">
                          {format(new Date(division.createdAt), "dd MMM yyyy")}
                        </span>
                        <span className="text-xs text-slate-400">
                          {format(new Date(division.updatedAt), "dd MMM yyyy")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDivisions.onEdit(division)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDivisions.onDelete(division)}>
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

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Activate</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            {pendingStatus
              ? "Are you sure you want to activate all WFA (Work From Anywhere) and inactivate all WFO (Work From Office)?"
              : "Are you sure you want to deactivate all WFA and activate all WFO?"}
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
