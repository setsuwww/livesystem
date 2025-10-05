"use client"

import Link from "next/link";
import { MoreVertical, CalendarDays } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown-menu";
import { ShiftAssignedUsersModal } from "./ShiftAssignedUsersModal";

import { capitalize } from "@/function/globalFunction";
import { shiftStyles } from "@/constants/shiftConstants";

export function ShiftsDuplicateCard({ shifts, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shifts.map((shift) => (
        <Card key={shift.id} className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="flex flex-col">
                <h3 className="text-slate-600">{capitalize(shift.type)}</h3>
                <p className="text-xs text-slate-400">{shift.shiftName}</p>
                <Badge className={`mt-2 ${shiftStyles[shift.type]}`}>
                  {shift.timeRange}
                </Badge>
              </div>
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0.5 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onEdit(shift.id)}
                  className="hover:text-slate-600"
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(shift.id)}
                  className="hover:bg-rose-50 text-rose-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <p className="text-base font-semibold text-slate-600 mb-4">
                Assigned users:
              </p>
              <ul className="space-y-2">
                {shift.users?.slice(0, 3).map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-x-2 justify-between border-b border-slate-200 pb-2"
                  >
                    <span className="font-semibold text-slate-600 text-sm">
                      {user.name}
                    </span>
                    <span className="text-xs text-sky-500">{user.email}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Schedules count */}
            <div className="flex items-center justify-between space-x-2 pb-2">
              <div className="flex items-center justify-between space-x-2">
                <div className="p-2 bg-slate-200 text-slate-600 rounded-lg">
                  <CalendarDays size={16} strokeWidth={2} />
                </div>
                <div className="text-sm flex items-center">
                  <span>Schedules : {shift.schedulesCount}</span>
                </div>
              </div>
              <p>
                {shift.users?.length > 3 && (
                  <ShiftAssignedUsersModal shift={shift} />
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
