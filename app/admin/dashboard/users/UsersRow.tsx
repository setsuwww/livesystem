"use client"

import React, { useMemo } from "react"
import { format } from "date-fns";
import { CircleUserRound } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/Table"
import { UsersActionButton } from "./UsersActionButton"

import { UsersRowProps } from '@/static/interfaces/UserRowProps';

export const UsersRow = React.memo(function({ user, isSelected, onToggleSelect, onEdit, onDelete, roleStyles }: UsersRowProps) { 
  const handleToggle = () => {onToggleSelect(user.id)}

  const formatedCreatedDate = useMemo(() => 
    format(new Date(user.createdAt), "dd-MM-yyyy"),
  [user.createdAt])

  const formatedUpdatedDate = useMemo(() => 
    format(new Date(user.updatedAt), "dd-MM-yyyy"),
  [user.updatedAt])

  return (
    <TableRow>
      <TableCell><input type="checkbox" checked={isSelected} onChange={handleToggle} /></TableCell>
      <TableCell>
        <div className="flex items-center gap-x-2">
          <div className="p-2 bg-gray-200 rounded-full">
            <CircleUserRound strokeWidth={1.5} className="text-gray-600" />
          </div>
          <div>
            <h2 className="text-gray-600 font-semibold">{user.name}</h2>
            <p className="text-gray-400 font-base">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className={`px-2 py-0.5 text-xs border font-semibold rounded-full ${roleStyles[user.role] || ""}`}>
          {user.role}
        </span>
      </TableCell>
      <TableCell><span className="text-xs font-semibold">{user.shift || "No Shift"}</span></TableCell>
      <TableCell className="flex flex-col">
        <span className="text-sm font-semibold">{formatedCreatedDate}</span>
        <span className="text-xs font-light text-gray-500">{formatedUpdatedDate}</span>
      </TableCell>
      <TableCell>
        <UsersActionButton userId={user.id} onEdit={onEdit} onDelete={onDelete}/>
      </TableCell>
    </TableRow>
  )
})