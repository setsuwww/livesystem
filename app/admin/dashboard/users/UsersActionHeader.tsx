import { Trash2, FolderInput } from "lucide-react"

import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

import { UsersActionHeaderProps } from "@/static/interfaces/UsersActionHeaderProps"

export const UsersActionHeader = ({ search, onSearchChange, roleFilter, onRoleFilterChange, shiftFilter, onShiftFilterChange, selectedCount, onDeleteSelected, onDeleteAll, onExportPDF, filteredData }: UsersActionHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">

      <div className="flex items-center gap-2">
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-gray-700 mr-1">Role:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>

        <Select value={shiftFilter} onValueChange={onShiftFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-gray-700 mr-1">Shift:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Morning">Morning</SelectItem>
            <SelectItem value="Afternoon">Afternoon</SelectItem>
            <SelectItem value="Night">Night</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Search..." value={search} onChange={e => onSearchChange(e.target.value)} className="w-full sm:w-64 bg-white py-2"/>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="destructive" size="sm" onClick={onDeleteSelected} disabled={selectedCount === 0}>
          Delete Selected <span className="bg-white text-xs font-semibold px-1 rounded-md text-red-500">{selectedCount}</span>
        </Button>

        <Button variant="destructive" size="sm" onClick={onDeleteAll}>
          <Trash2 size={18} strokeWidth={2} />
          Delete All
        </Button>

        <Button variant="custom" size="sm" onClick={() => onExportPDF(filteredData)} className="bg-green-600 hover:bg-green-500 border-green-600 text-white">
          <FolderInput size={16} /> Export PDF
        </Button>
      </div>
    </div>
  )
}