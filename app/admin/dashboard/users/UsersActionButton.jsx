import { Button } from "@/components/ui/Button"

export const UsersActionButton = ({ userId, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => onEdit(userId)}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={() => onDelete(userId)}>
        Delete
      </Button>
    </div>
  )
}
