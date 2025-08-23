import { Button } from "@/components/ui/Button"
import { UsersActionButtonProps } from "@/static/interfaces/UsersActionButtonProps"
import { RefreshCcw } from "lucide-react"

export const UsersActionButton = ({ userId, onSwitchUser, onEdit, onDelete }: UsersActionButtonProps) => {
  const handleSwitchUser = () => onSwitchUser(userId)
  const handleEdit = () => onEdit(userId)
  const handleDelete = () => onDelete(userId)

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="outline" onClick={handleSwitchUser}>
        <RefreshCcw size={14} />
      </Button>
      <Button size="sm" variant="outline" onClick={handleEdit}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  )
}
