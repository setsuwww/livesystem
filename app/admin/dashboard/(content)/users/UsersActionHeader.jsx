"use client";

import { Trash2, FolderInput } from "lucide-react";
import { Input } from "@/_components/ui/Input";
import { Button } from "@/_components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/Select";

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
            <span className="font-semibold text-slate-600 mr-1">Role:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>

        <Select value={shiftFilter} onValueChange={onShiftFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-slate-600 mr-1">Shift:</span>
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
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64 py-2" typeSearch={true}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-rose-500"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          Delete Selected
        </Button>

        <Button variant="ghost" size="sm" className="bg-rose-50 hover:bg-rose-100 text-rose-500"
          onClick={onDeleteAll}>
          <Trash2 size={18} strokeWidth={2} />
          Delete All
        </Button>

        <Button variant="ghost" size="sm" className="bg-emerald-100/50 hover:bg-emerald-100 text-emerald-600"
          onClick={() => onExportPDF(filteredData)}>
          <FolderInput size={16} />
          Export
        </Button>
      </div>
    </div>
  );
};