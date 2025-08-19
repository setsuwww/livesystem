import { Schedule } from "./Schedule";
import { User } from "./User";

export interface Shift {
  id: number;
  type: string;
  startTime: string | Date;
  endTime: string | Date;
  users?: User[];
  schedules?: Schedule[];
}