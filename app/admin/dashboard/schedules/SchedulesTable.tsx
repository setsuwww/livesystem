"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import SchedulesActionHeader from "./SchedulesActionHeader";
import { SchedulesRow } from "./SchedulesRow";

import { handleSchedules } from "@/function/handleSchedules"; // ✅ centralized logic
import { ScheduleTableProps } from "@/static/interfaces/ScheduleTableProps";

export default function ScheduleTable({ data }: ScheduleTableProps) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const router = useRouter();

  const filteredData = useMemo(() => {
    const filtered = data.filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [data, search, sortOrder]);

  const { toggleSelect, selectAll, deleteSelected, deleteAll, handleEditSchedule, handleDeleteSchedule, onExportPDF } = handleSchedules(selectedIds, setSelectedIds, filteredData, () => router.refresh());

  return (
    <div className="space-y-4">
      <SchedulesActionHeader
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        selectedCount={selectedIds.length}
        totalCount={filteredData.length}
        onDeleteSelected={deleteSelected}
        onDeleteAll={deleteAll}
        onExportPDF={() => onExportPDF(filteredData)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                onChange={selectAll}
                disabled={filteredData.length === 0}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No schedules found
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((schedule) => (
              <SchedulesRow
                key={schedule.id}
                schedule={schedule}
                isSelected={selectedIds.includes(schedule.id)}
                onSelect={() => toggleSelect(schedule.id)} // ✅ ganti toggleSelectItem
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
