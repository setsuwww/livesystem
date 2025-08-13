export interface UsersActionHeaderProps {
  search: string
  onSearchChange: (value: string) => void

  roleFilter: string
  onRoleFilterChange: (value: string) => void

  shiftFilter: string
  onShiftFilterChange: (value: string) => void

  selectedCount: number
  onDeleteSelected: () => void
  onDeleteAll: () => void
}