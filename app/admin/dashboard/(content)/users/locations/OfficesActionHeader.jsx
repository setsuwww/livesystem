"use client"

import { Trash2, FolderInput, Building2 } from "lucide-react"
import { Input } from "@/_components/ui/Input"
import { Button } from "@/_components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/Select"

export const OfficesActionHeader = ({
  search, onSearchChange,
  typeFilter, onTypeFilterChange,
  statusFilter, onStatusFilterChange,
  selectedCount, onDeleteSelected, onDeleteAll,
  onExportPDF, filteredData,
  searchInputRef,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      {/* LEFT: Filters & Search */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-slate-600 mr-1">Type:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="WFO">WFO</SelectItem>
            <SelectItem value="WFA">WFA</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-slate-600 mr-1">Status:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Input */}
        <Input
          ref={searchInputRef}
          placeholder="Search office..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64 bg-white py-2"
        />
      </div>

      {/* RIGHT: Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          className="text-rose-500"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          Delete Selected
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="bg-rose-50 hover:bg-rose-100 text-rose-500"
          onClick={onDeleteAll}
        >
          <Trash2 size={18} strokeWidth={2} />
          Delete All
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="bg-teal-100 hover:bg-teal-200 text-teal-700"
          onClick={() => onExportPDF(filteredData)}
        >
          <FolderInput size={16} />
          Export
        </Button>
      </div>
    </div>
  )
}
