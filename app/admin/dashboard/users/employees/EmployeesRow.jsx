"use client";

import React, { useState } from "react";
import { CircleUserRound } from "lucide-react";

import { TableRow, TableCell } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { EmployeesActionButton } from "./EmployeesActionButton";
import { EmployeesSwitchModal } from "./EmployeesSwitchModal";

import { format } from "date-fns";
import { capitalize } from "@/function/globalFunction";

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
          <div className="p-2 bg-zinc-200 text-zinc-500 rounded-full">
            <CircleUserRound className="h-5 w-5 text-zinc-600" strokeWidth={1} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-600">
              {user.name}
            </span>
            <span className="text-xs text-zinc-400">{user.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col text-sm text-zinc-600">
          <p className="font-semibold">{capitalize(user.shift?.type)}</p>

          <p className="text-xs text-zinc-400">
            <span>{user.shift?.startTime}</span> - <span>{user.shift?.endTime}</span>
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge className="px-2 py-0.5 text-xs font-semibold text-green-600 bg-green-100 border-green-300">
          {capitalize(user.role)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-600">
            {user.createdAt ? format(new Date(user.createdAt), "dd MMMM yyyy") : "-"}
          </span>
          <span className="text-xs text-zinc-400">
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
          open={switchOpen}
          onOpenChange={setSwitchOpen}
          currentUserId={user.id}
        />
      </TableCell>
    </TableRow>
  );
})
