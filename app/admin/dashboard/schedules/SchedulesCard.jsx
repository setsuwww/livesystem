"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, MoreHorizontal, User2 } from "lucide-react";
import { format } from "date-fns";

import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown-menu";

import SchedulesActionHeader from "./SchedulesActionHeader";
import ScheduleUsersDialog from "./SchedulesUsersDialog";
import { handleSchedules } from "@/function/handleSchedules";
import { capitalize } from "@/function/globalFunction";
import { frequencyStyles } from "@/constants/frequencyStyles";

export default function SchedulesCard({ data }) {
  const [search, setSearch] = useState("");
  const [filterFrequency, setFilterFrequency] = useState("all");
  const [filterShift, setFilterShift] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  const router = useRouter();

  const filteredData = useMemo(() => {
  const safeData = Array.isArray(data) ? data : [];

  return safeData
    .filter((s) => {
      const title = s?.title ?? "";
      const desc = s?.description ?? "";
      return (
        title.toLowerCase().includes(search.toLowerCase()) ||
        desc.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((s) => {
      if (filterShift === "all") return true;
      return s.shift?.type === filterShift;
    })
    .filter((s) => {
      if (filterFrequency === "all") return true;
      return s.frequency === filterFrequency;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA; // newest first
    });
  }, [data, search, filterFrequency, filterShift]);

  const {
    toggleSelect, deleteSelected, deleteAll,
    handleEditSchedule, handleDeleteSchedule,
    onExportPDF,
  } = handleSchedules(
    selectedIds, setSelectedIds, filteredData, () => router.refresh()
  );

  return (
    <div className="space-y-4">
      <SchedulesActionHeader
        search={search} setSearch={setSearch}
        filterFrequency={filterFrequency} onFilterFrequencyChange={setFilterFrequency}
        selectedCount={selectedIds.length} totalCount={filteredData.length}
        onDeleteSelected={deleteSelected} onDeleteAll={deleteAll}
        filterShift={filterShift} onFilterShiftChange={setFilterShift}
        onExportPDF={() => onExportPDF(filteredData)}
      />

      {filteredData.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No schedules found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredData.map((schedule) => {
            const formatedCreatedDate = format(new Date(schedule.createdAt), "dd-MMMM-yyyy");
            const formatedUpdatedDate = format(new Date(schedule.updatedAt), "dd-MMMM-yyyy");

            return (
              <Card key={schedule.id} className="relative group">
                <CardHeader className="flex flex-row items-center justify-between px-6 py-3">
                  <CardTitle>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${frequencyStyles[capitalize(schedule.frequency)]}`}>
                        <CalendarClock strokeWidth={1.5} size={20} />
                      </div>
                      <div className="flex font-semibold text-zinc-600">
                        <h2 className="leading-snug">{schedule.title}</h2>
                      </div>
                    </div>
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedIds.includes(schedule.id)} className="border-zinc-300"
                      onCheckedChange={(checked) => toggleSelect(schedule.id, checked === true)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md bg-zinc-50 hover:bg-zinc-100">
                          <MoreHorizontal className="w-5 h-5 text-zinc-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-28">
                        <DropdownMenuItem onClick={() => handleEditSchedule(schedule.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm font-semibold text-zinc-600">Assigned Users:</p>
                  <ScheduleUsersDialog users={schedule.users} schedules={schedule} />
                </CardContent>

                <CardFooter className="flex justify-between items-center text-xs text-zinc-500">
                  <div>
                    <div className="font-semibold text-zinc-600">{formatedCreatedDate}</div>
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
