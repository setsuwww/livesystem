"use client"

import React, { useMemo, useCallback, memo } from "react"

import { TableCell, TableRow } from "@/components/ui/table"
import { UsersTableAction } from "./UsersActionButton"

import { User } from "@/static/types/User"

export const UsersRow = memo(({ user, isSelected, onToggleSelect, onEdit, onDelete, roleStyles }: {
  user: User, 
  isSelected: boolean, onToggleSelect: (id: number) => void, 
  onEdit: (id: number) => void, 
  onDelete: (id: number) => void, 
  roleStyles: Record<string, string>
}) => { const handleToggle = useCallback(() => { onToggleSelect(user.id)}, [user.id, onToggleSelect])

  const formattedDate = useMemo(() => 
    new Date(user.createdAt).toLocaleDateString(),
  [user.createdAt])

  return (
    <TableRow>
      <TableCell>
        <input type="checkbox" checked={isSelected} onChange={handleToggle} />
      </TableCell>
      <TableCell>{user.id}</TableCell>
      <TableCell>
        <h2 className="text-gray-600 font-semibold">{user.name}</h2>
        <p className="text-gray-400 font-base">{user.email}</p>
      </TableCell>
      <TableCell>
        <span className={roleStyles[user.role] || ""}>
          {user.role}
        </span>
      </TableCell>
      <TableCell>{user.shift || "No Shift"}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell className="text-center">
        <UsersTableAction userId={user.id} onEdit={onEdit} onDelete={onDelete}/>
      </TableCell>
    </TableRow>
  )
})

UsersRow.displayName = 'UsersRow'