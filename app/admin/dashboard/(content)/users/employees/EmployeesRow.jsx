"use client";

import React, { useState } from "react";
import { CircleUserRound } from "lucide-react";

import { TableRow, TableCell } from "@/_components/ui/Table";
import { Checkbox } from "@/_components/ui/Checkbox";
import { Badge } from "@/_components/ui/Badge";
import { EmployeesActionButton } from "./EmployeesActionButton";
import { EmployeesSwitchModal } from "./EmployeesSwitchModal";

import { format } from "date-fns";
import { capitalize } from "@/_function/globalFunction";

export const EmployeesRow = React.memo(function EmployeesRow({ user, selected, toggleSelect, onHistory, onEdit, onDelete }) {
  const [switchOpen, setSwitchOpen] = useState(false);
  return (
    <TableRow key={user.id}>
      <TableCell>
        <Checkbox
          checked={selected.includes(user.id)}
          onCheckedChange={() => toggleSelect(user.id)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-200 text-slate-500 rounded-full">
            <CircleUserRound className="h-5 w-5 text-slate-600" strokeWidth={1} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-600">
              {user.name}
            </span>
            <span className="text-xs text-slate-400">{user.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col text-sm text-slate-600">
          <p className="font-semibold">{capitalize(user.shift?.type)}</p>

          <p className="text-xs text-slate-400">
            <span>{user.shift?.startTime}</span> - <span>{user.shift?.endTime}</span>
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge className="px-2 py-0.5 text-xs font-semibold text-teal-600 bg-teal-100 border-teal-300">
          {capitalize(user.role)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className="bg-sky-50 text-sky-700 border-sky-100">
          {capitalize(user.division?.name)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-600">
            {user.createdAt ? format(new Date(user.createdAt), "dd MMMM yyyy") : "-"}
          </span>
          <span className="text-xs text-slate-400">
            {user.updatedAt ? format(new Date(user.updatedAt), "dd MMMM yyyy") : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <EmployeesActionButton
          onHistory={onHistory}
          onSwitch={() => setSwitchOpen(true)}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <EmployeesSwitchModal
          key={user.id}
          open={switchOpen}
          onOpenChange={setSwitchOpen}
          currentUserId={user.id}
        />
      </TableCell>
    </TableRow>
  );
})
