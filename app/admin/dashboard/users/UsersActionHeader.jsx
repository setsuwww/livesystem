"use client";

import { Trash2, FolderInput } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

export const UsersActionHeader = ({
  search, onSearchChange,
  roleFilter, onRoleFilterChange,
  shiftFilter, onShiftFilterChange,
  selectedCount, onDeleteSelected, onDeleteAll,
  onExportPDF, filteredData,
  searchInputRef,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-zinc-600 mr-1">Role:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="COORDINATOR">Coordinator</SelectItem>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
            <SelectItem v alue="USER">User</SelectItem>
          </SelectContent>
        </Select>

        <Select value={shiftFilter} onValueChange={onShiftFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-zinc-600 mr-1">Shift:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="MORNING">Morning</SelectItem>
            <SelectItem value="AFTERNOON">Afternoon</SelectItem>
            <SelectItem value="EVENING">Evening</SelectItem>
          </SelectContent>
        </Select>

        <Input ref={searchInputRef}
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64 bg-white py-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-red-500"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          Delete Selected
        </Button>

        <Button variant="ghost" size="sm" className="bg-red-50 hover:bg-red-100 text-red-500"
          onClick={onDeleteAll}>
          <Trash2 size={18} strokeWidth={2} />
          Delete All
        </Button>

        <Button variant="ghost" size="sm" className="bg-green-100 hover:bg-green-200 text-green-700"
          onClick={() => onExportPDF(filteredData)}>
          <FolderInput size={16} />
          Export
        </Button>
      </div>
    </div>
  );
};