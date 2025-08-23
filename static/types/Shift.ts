import { ShiftType } from "@prisma/client";
import { Schedule } from "./Schedule";
import { User } from "./User";

export interface Shift {
  id: number;
  type: ShiftType;
  customType?: string | null;
  startTime: string | Date;
  endTime: string | Date;
  users?: User[];
  schedules?: Schedule[];
}
