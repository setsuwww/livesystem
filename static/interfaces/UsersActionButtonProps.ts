export interface UsersActionButtonProps {
  userId: number
  onSwitchUser: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}