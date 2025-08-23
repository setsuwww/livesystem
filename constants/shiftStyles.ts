import { ShiftType } from "@prisma/client";

export const shiftStyles: Record<ShiftType, string> = {
  [ShiftType.MORNING]: "text-yellow-600 bg-yellow-100 border-yellow-300",
  [ShiftType.AFTERNOON]: "text-orange-600 bg-orange-100 border-orange-300",
  [ShiftType.NIGHT]: "text-violet-600 bg-violet-100 border-violet-300",
  [ShiftType.OFF]: "text-sky-600 bg-sky-100 border-sky-300",
};
