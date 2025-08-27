"use client"

import React, { useMemo } from "react"
import { format } from "date-fns"
import { CircleUserRound, Sun, Cloud, Moon, MinusCircle } from "lucide-react"

import { TableCell, TableRow } from "@/components/ui/Table"
import { Checkbox } from "@/components/ui/Checkbox"
import { Badge } from "@/components/ui/Badge"

import { UsersActionButton } from "./UsersActionButton"
import { capitalize } from './../../../../function/helpers/timeHelpers';

const shiftIcons = {
  Morning: <Sun className="size-5 " />,
  Afternoon: <Cloud className="size-5" />,
  Evening: <Moon className="size-5" />,
  OFF: <MinusCircle className="size-5" />,
}

export const shiftStyles = {
  Morning: "bg-yellow-100 text-yellow-500",
  Afternoon: "bg-orange-100 text-orange-500",
  Evening: "bg-violet-100 text-violet-500",
  OFF: "bg-zinc-50 text-zinc-100",
}



export const UsersRow = React.memo(function UsersRow({ user, isSelected, onToggleSelect, onEdit, onDelete, roleStyles }) {
  const handleToggle = () => onToggleSelect(user.id)

  const formatedCreatedDate = useMemo(
    () => format(new Date(user.createdAt), "dd-MM-yyyy"),
    [user.createdAt]
  )

  const formatedUpdatedDate = useMemo(
    () => format(new Date(user.updatedAt), "dd-MM-yyyy"),
    [user.updatedAt]
  )

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={handleToggle} />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <div className="bg-zinc-200 p-2 rounded-full">
            <CircleUserRound className="h-5 w-5 text-zinc-600" strokeWidth={1} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-600">{user.name}</p>
            <p className="text-xs text-zinc-400">{user.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant="outline" className={`${roleStyles[user.role] || ""} px-2 py-0.5 text-xs font-semibold`}>
          {user.role}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center p-1.5 rounded-lg ${shiftStyles[capitalize(user.shift)] || shiftStyles.OFF}`}>
            {shiftIcons[capitalize(user.shift)] || shiftIcons.OFF}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-600">
              {user.shift ?? "OFF"}
            </span>
            <span className="text-xs text-zinc-400">
              {user.shiftTime ?? "OFF"}
            </span>
          </div>
        </div>
      </TableCell>


      <TableCell className="flex flex-col">
        <span className="text-sm font-semibold">{formatedCreatedDate}</span>
        <span className="text-xs text-zinc-400">{formatedUpdatedDate}</span>
      </TableCell>

      <TableCell>
        <UsersActionButton
          userId={user.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  )
})
