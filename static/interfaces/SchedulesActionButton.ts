export interface SchedulesActionButton {
  id: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}