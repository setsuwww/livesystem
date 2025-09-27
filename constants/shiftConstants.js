import { Sun, SunMoon, Moon, CircleOff } from "lucide-react";

export const shiftStyles = {
  MORNING: "text-yellow-600 bg-yellow-100 border-yellow-400",
  AFTERNOON: "text-orange-600 bg-orange-100 border-orange-300",
  EVENING: "text-violet-600 bg-violet-100 border-violet-300",
  OFF: "text-gray-600 bg-gray-100 border-gray-300",
};

export const shiftIcons = {
  MORNING: <Sun className="w-4 h-4 text-yellow-500" />,
  AFTERNOON: <SunMoon className="w-4 h-4 text-orange-500" />,
  EVENING: <Moon className="w-4 h-4 text-violet-500" />,
  OFF: <CircleOff className="w-4 h-4 text-gray-500" />,
};

export const defaultShifts = ["MORNING", "AFTERNOON", "EVENING"];