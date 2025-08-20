import React, { useMemo } from "react";
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";

import ScheduleActionsButtons from "./SchedulesActionButton";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";

import { SchedulesRowProps } from "@/static/interfaces/SchedulesRowProps";
import { capitalize } from "@/function/functionFormatters";


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
        <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(schedule.id, checked === true)} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-x-2">
          <div className="p-2 bg-gray-200 rounded-full">
            <CalendarClock strokeWidth={1.5} className="text-gray-700" />
          </div>
          <div className="flex flex-col gap-x-2">
          <h1 className="text-base font-bold text-gray-600">
            {capitalize(schedule.title)}
          </h1>
          <p className="text-xs font-base text-gray-400">
            {capitalize(schedule.shift ? schedule.shift.type : "-")}
          </p>
          </div>
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
