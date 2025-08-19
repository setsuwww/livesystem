export interface UsersActionButtonProps {
  userId: number
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}