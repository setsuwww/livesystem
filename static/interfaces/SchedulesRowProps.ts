import { ScheduleWithShift } from "../types/Schedule";

export interface SchedulesRowProps {
  schedule: ScheduleWithShift;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
}
