"use client"

import { memo, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import { Trash2 } from "lucide-react"

interface UsersTableActionProps {
  userId: number
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

function UsersActionButton({ userId, onEdit, onDelete }: UsersTableActionProps) {
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
