import { User } from '@/static/types/User';

export interface UsersRowProps {
  user: User
  isSelected: boolean
  onToggleSelect: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onSwitchUser: (id: number) => void
  roleStyles: Record<string, string>
}

export interface UsersRowUI {
  id: number
  name: string
  email: string
  role: string
  shift: string
  createdAt: string
  updatedAt: string
}