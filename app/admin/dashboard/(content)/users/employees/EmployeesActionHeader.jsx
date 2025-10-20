"use client";

import React from "react";
import { FolderInput, Trash2 } from "lucide-react";
import { Input } from "@/_components/ui/Input";
import { Button } from "@/_components/ui/Button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/_components/ui/Select";

export const EmployeesActionHeader = React.memo(function EmployeesActionHeader({
  search, setSearch,
  selected, onDeleteSelected,
  onDeleteAll, onExport,
  officeFilter, setOfficeFilter,
  shiftFilter, setShiftFilter,
  offices = [], shifts = [],
}) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2 w-full md:w-2/3">
        
        <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 min-w-[160px]"
        />

        <Select value={officeFilter} onValueChange={(value) => setOfficeFilter(value)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter Office" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
            {offices.map((office) => (
              <SelectItem key={office.id} value={String(office.id)}>
                {office.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={shiftFilter} onValueChange={(value) => setShiftFilter(value)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            {shifts.map((shift) => (
              <SelectItem key={shift.id} value={String(shift.id)}>
                {shift.name} ({shift.startTime} - {shift.endTime})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-x-2">
        <Button variant="ghost" className="text-rose-500" size="sm"
          onClick={onDeleteSelected}
          disabled={!selected.length}
        >
          Delete Selected
        </Button>
        <Button variant="ghost" className="bg-rose-50 text-rose-500 hover:bg-rose-100" size="sm"
          onClick={onDeleteAll}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete All
        </Button>
        <Button variant="ghost" className="bg-teal-100 text-teal-600 hover:bg-teal-200" size="sm"
          onClick={onExport}
        >
          <FolderInput className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
});
