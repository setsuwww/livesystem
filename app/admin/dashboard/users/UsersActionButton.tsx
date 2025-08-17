import { Button } from "@/components/ui/Button"
import { UsersActionButtonProps } from "@/static/interfaces/UsersActionButtonProps"

export const UsersActionButton = ({ userId, onEdit, onDelete }: UsersActionButtonProps) => {
  const handleEdit = () => onEdit(userId)
  const handleDelete = () => onDelete(userId)

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={handleEdit}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  )
}
