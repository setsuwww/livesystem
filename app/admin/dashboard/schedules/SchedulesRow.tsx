import React, { useMemo } from "react";
import { format } from "date-fns";

import { CalendarDays } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";

import { SchedulesRowProps } from "@/static/interfaces/SchedulesRowProps";
import ScheduleActionsButtons from "./SchedulesActionButton";

export const SchedulesRow = React.memo(function ({ schedule, isSelected, onSelect, onEdit, onDelete }: SchedulesRowProps) {

  const formatedUpdatedDate = useMemo(() => 
    format(new Date(schedule.updatedAt), "dd-MM-yyyy"),
  [schedule.updatedAt])

  const formatedCreatedDate = useMemo(() => 
    format(new Date(schedule.createdAt), "dd-MM-yyyy"),
  [schedule.createdAt])

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isSelected} onChange={(e) => onSelect(schedule.id, e.target.checked)}/>
      </TableCell>
      <TableCell>{schedule.id}</TableCell>
      <TableCell>
        <div className="flex items-center gap-x-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-600">
            <CalendarDays strokeWidth={1.75} size={20} />
          </div>
          <span className="text-base font-semibold text-gray-600">
            {schedule.title}
          </span>
        </div>
      </TableCell>
      <TableCell>{schedule.description}</TableCell>
      <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
      <TableCell>
        <div>
          <div className="text-sm font-semibold">
            {formatedCreatedDate}
          </div>
          <div className="text-xs text-gray-400">
            {formatedUpdatedDate}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <ScheduleActionsButtons id={schedule.id} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
})
