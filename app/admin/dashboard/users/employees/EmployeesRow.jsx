"use client";

import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { CircleUserRound } from "lucide-react";
import { format } from "date-fns";
import { capitalize } from "@/function/helpers/timeHelpers";
import { shiftStyles } from "@/constants/shiftStyles";
import EmployeesActionButton from "./EmployeesActionButton";
import { EmployeesSwitchModal } from "./EmployeesSwitchModal";

export default function EmployeesRow({ user, selected, toggleSelect, onSwitch, onEdit, onDelete }) {
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
        <Badge className={`px-2 py-0.5 text-xs font-semibold ${shiftStyles[user.shift?.type]}`}>
          {capitalize(user.shift?.type)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className="px-2 py-0.5 text-xs font-semibold text-green-600 bg-green-100 border-green-300">
          {capitalize(user.role)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {user.createdAt ? format(new Date(user.createdAt), "dd-MM-yyyy") : "-"}
          </span>
          <span className="text-xs text-zinc-500">
            {user.updatedAt ? format(new Date(user.updatedAt), "dd-MM-yyyy") : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <EmployeesActionButton
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
}
