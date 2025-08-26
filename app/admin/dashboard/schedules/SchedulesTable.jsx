"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import SchedulesActionHeader from "./SchedulesActionHeader";
import { SchedulesRow } from "./SchedulesRow";

import { handleSchedules } from "@/function/handleSchedules";

export default function ScheduleTable({ data }) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedIds, setSelectedIds] = useState([]);

  const router = useRouter();

  // ✅ selalu amanin data
  const filteredData = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];

    const filtered = safeData.filter((s) => {
      const title = s?.title ?? "";
      const desc = s?.description ?? "";
      return (
        title.toLowerCase().includes(search.toLowerCase()) ||
        desc.toLowerCase().includes(search.toLowerCase())
      );
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [data, search, sortOrder]);

  const {
    toggleSelect,
    selectAll,
    deleteSelected,
    deleteAll,
    handleEditSchedule,
    handleDeleteSchedule,
    onExportPDF,
  } = handleSchedules(
    selectedIds,
    setSelectedIds,
    filteredData,
    () => router.refresh()
  );

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
                checked={
                  selectedIds.length === filteredData.length &&
                  filteredData.length > 0
                }
                onChange={selectAll}
                disabled={filteredData.length === 0}
              />
            </TableHead>
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
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No schedules found
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((schedule) => (
              <SchedulesRow
                key={schedule.id}
                schedule={schedule}
                isSelected={selectedIds.includes(schedule.id)}
                onSelect={() => toggleSelect(schedule.id)}
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
