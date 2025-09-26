import { FolderInput, Trash2, Search } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SchedulesActionHeader({
  search, setSearch,
  selectedCount, totalCount,
  onDeleteSelected, onDeleteAll,
  onExportPDF,
  filterShift, onFilterShiftChange,
  filterFrequency, onFilterFrequencyChange
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2 w-full">
        <Select value={filterFrequency} onValueChange={onFilterFrequencyChange} defaultValue="all">
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-zinc-600 mr-1">Frequency:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="YEARLY">Yearly</SelectItem>
            <SelectItem value="ONCE">Once</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterShift} onValueChange={onFilterShiftChange} defaultValue="all">
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-zinc-600 mr-1">Shift:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="MORNING">Morning</SelectItem>
            <SelectItem value="AFTERNOON">Afternoon</SelectItem>
            <SelectItem value="EVENING">Evening</SelectItem>
            <SelectItem value="NIGHT">Night</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schedules..."
          className="min-w-[180px] max-w-[250px] w-auto"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-x-2">
        <Button variant="ghost" size="sm" className="text-red-500"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          Delete Selected
        </Button>

        <Button variant="ghost" size="sm" className="bg-red-50 hover:bg-red-100 text-red-500"
          onClick={onDeleteAll}
        >
          <Trash2 size={16} /> Delete All
        </Button>

        <Button variant="ghost" size="sm" className="bg-green-100 hover:bg-green-200 text-green-700"
          onClick={onExportPDF}
        >
          <FolderInput size={16} /> Export
        </Button>
      </div>
    </div>
  );
}
