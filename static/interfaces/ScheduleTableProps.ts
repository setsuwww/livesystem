import { Schedule } from "../types/Schedule";

export interface ScheduleTableProps {
  data: Schedule[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onDeleteMultiple?: (ids: number[]) => void;
}