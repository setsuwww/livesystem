"use client"

import { memo, useCallback } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/Button"

import { UsersActionButtonProps } from "@/static/interfaces/UsersActionButtonProps"

function UsersActionButton({ userId, onEdit, onDelete }: UsersActionButtonProps) {
  const handleEdit = useCallback(() => onEdit(userId), [onEdit, userId])
  const handleDelete = useCallback(() => onDelete(userId), [onDelete, userId])

  return (
    <div className="flex items-center justify-end gap-2">
      <Button size="sm" variant="secondary" onClick={handleEdit}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={handleDelete}>
        <Trash2 size={18} />
        Delete
      </Button>
    </div>
  )
}

export const UsersTableAction = memo(UsersActionButton)
