import { Schedule } from "../types/Schedule";

export interface SchedulesRowProps {
  schedule: Schedule;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}