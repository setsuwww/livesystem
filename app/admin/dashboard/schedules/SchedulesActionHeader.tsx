import { FolderInput, Trash2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { ScheduleActionHeaderProps } from "@/static/interfaces/ScheduleActionHeaderProps";

export default function SchedulesActionHeader({ search, setSearch, sortOrder, onSortChange, selectedCount, totalCount, onDeleteSelected, onDeleteAll, onExportPDF }: ScheduleActionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-x-1">
        <Input placeholder="Search schedule..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64 bg-white py-1.5"/>

<Tabs
  value={sortOrder}
  onValueChange={(v) => onSortChange(v as "newest" | "oldest")}
  className="w-full"
>
  <TabsList className="flex space-x-1">
    <TabsTrigger value="newest" className="px-1 py-3 text-sm">
      Newest
    </TabsTrigger>
    <TabsTrigger value="oldest" className="px-1 py-3 text-sm">
      Oldest
    </TabsTrigger>
  </TabsList>
</Tabs>

      </div>

      <div className="flex items-center gap-x-2">
        <Button variant="destructive" size="sm" onClick={onDeleteSelected} disabled={selectedCount === 0}>
          Delete Selected <span className="bg-white text-xs font-semibold px-1 rounded-md text-red-500">{selectedCount}</span>
        </Button>

        <Button size="sm" variant="destructive" onClick={onDeleteAll} disabled={totalCount === 0}>
          <Trash2 size={16} /> Delete All
        </Button>

        <Button variant="custom" size="sm" onClick={onExportPDF} disabled={totalCount === 0} className="bg-green-600 hover:bg-green-500 border-green-600 text-white">
          <FolderInput size={16} /> Export PDF
        </Button>
      </div>
    </div>
  );
}
