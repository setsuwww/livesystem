import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { UsersActionButtonProps } from "@/static/interfaces/UsersActionButtonProps"

export const UsersActionButton = ({ userId, onEdit, onDelete }: UsersActionButtonProps) => {
  const handleEdit = () => onEdit(userId)
  const handleDelete = () => onDelete(userId)

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
