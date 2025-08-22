import { Schedule } from "../types/Schedule";

export interface ScheduleTableProps {
  userId?: number;
  data: Schedule[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onDeleteMultiple?: (ids: number[]) => void;
}