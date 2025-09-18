"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown-menu";

import SchedulesActionHeader from "./SchedulesActionHeader";
import { handleSchedules } from "@/function/handleSchedules";
import { capitalize } from "@/function/globalFunction";
import { frequencyStyles } from "@/constants/frequencyStyles";

export default function SchedulesCard({ data }) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedIds, setSelectedIds] = useState([]);

  const router = useRouter();

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
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [data, search, sortOrder]);

  const {
    toggleSelect, deleteSelected, deleteAll,
    handleEditSchedule, handleDeleteSchedule,
    onExportPDF,
  } = 
  handleSchedules(
    selectedIds, setSelectedIds, filteredData, () => router.refresh()
  );

  return (
    <div className="space-y-4">
      <SchedulesActionHeader
        search={search} setSearch={setSearch}
        sortOrder={sortOrder} onSortChange={setSortOrder}
        selectedCount={selectedIds.length} totalCount={filteredData.length}
        onDeleteSelected={deleteSelected} onDeleteAll={deleteAll}
        onExportPDF={() => onExportPDF(filteredData)}
      />

      {filteredData.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No schedules found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredData.map((schedule) => {
            const formatedCreatedDate = format(new Date(schedule.createdAt),
              "dd-MMMM-yyyy"
            );
            const formatedUpdatedDate = format(new Date(schedule.updatedAt),
              "dd-MMMM-yyyy"
            );

            return (
              <Card key={schedule.id} className="relative group">
                {/* Header */}
                <CardHeader className="flex flex-row items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <CardTitle>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${frequencyStyles[capitalize(schedule.frequency)]}`}>
                          <CalendarClock strokeWidth={1.5} size={20} />
                        </div>
                        <div className="flex flex-col font-semibold text-zinc-600">
                          <h2 className="leading-snug">
                            {capitalize(schedule.title)}
                          </h2>
                          <div className="text-xs text-zinc-400">
                            {capitalize(schedule.shift?.type ?? "-")}
                          </div>
                        </div>
                      </div>
                    </CardTitle>
                  </div>

                  {/* Checkbox + Ellipsis */}
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedIds.includes(schedule.id)}
                      className="border-zinc-400"
                      onCheckedChange={(checked) =>
                        toggleSelect(schedule.id, checked === true)
                      }
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md bg-zinc-50 hover:bg-zinc-100">
                          <MoreHorizontal className="w-5 h-5 text-zinc-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-28">
                        <DropdownMenuItem
                          onClick={() => handleEditSchedule(schedule.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="space-y-3">
                  <p className="text-sm text-zinc-500 whitespace-pre-wrap break-words">
                    {schedule.description}
                  </p>

                  <div className="text-xs font-semibold flex flex-col gap-0.5">
                    <span className="text-green-500">
                      {schedule.startDate
                        ? format(
                            new Date(schedule.startDate),
                            "dd-MMMM-yyyy HH:mm"
                          )
                        : "-"}
                    </span>
                    <span className="text-red-500">
                      {schedule.endDate
                        ? format(
                            new Date(schedule.endDate),
                            "dd-MMMM-yyyy HH:mm"
                          )
                        : "-"}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center text-xs text-zinc-500 px-6 py-3">
                  <div>
                    <div className="font-semibold text-zinc-600">
                      {formatedCreatedDate}
                    </div>
                    <div className="text-zinc-400">{formatedUpdatedDate}</div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
