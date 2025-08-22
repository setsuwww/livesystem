"use client"

import React, { useMemo } from "react"
import { format } from "date-fns"
import { CircleUserRound } from "lucide-react"

import { TableCell, TableRow } from "@/components/ui/Table"
import { Checkbox } from "@/components/ui/Checkbox"
import { Badge } from "@/components/ui/Badge"

import { UsersActionButton } from "./UsersActionButton"
import { UsersRowProps } from '@/static/interfaces/UserRowProps'

export const UsersRow = React.memo(function UsersRow({ user, isSelected, onToggleSelect, onEdit, onDelete, roleStyles }: UsersRowProps) {
  const handleToggle = () => onToggleSelect(user.id)

  const formatedCreatedDate = useMemo(() => format(new Date(user.createdAt), "dd-MM-yyyy"),
    [user.createdAt]
  )

  const formatedUpdatedDate = useMemo(() => format(new Date(user.updatedAt), "dd-MM-yyyy"),
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
            <CircleUserRound className="h-5 w-5 text-zinc-600" strokeWidth={1}/>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700">{user.name}</p>
            <p className="text-xs text-zinc-500">{user.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant="outline" className={`${roleStyles[user.role] || ""} px-2 py-0.5 text-xs font-semibold`}>
          {user.role}
        </Badge>
      </TableCell>

      <TableCell>
        <span className="text-xs font-semibold">
          {user.shift || "No Shift"}
        </span>
      </TableCell>

      <TableCell className="flex flex-col">
        <span className="text-sm font-medium">{formatedCreatedDate}</span>
        <span className="text-xs text-zinc-500">{formatedUpdatedDate}</span>
      </TableCell>

      <TableCell>
        <UsersActionButton userId={user.id} onEdit={onEdit} onDelete={onDelete}/>
      </TableCell>
    </TableRow>
  )
})
