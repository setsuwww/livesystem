import { Sun, SunMoon, Moon } from "lucide-react";

export const shiftStyles = {
  MORNING: "text-yellow-600 bg-yellow-100 border-yellow-200",
  AFTERNOON: "text-orange-600 bg-orange-100 border-orange-200",
  EVENING: "text-purple-600 bg-purple-100 border-purple-200",
};

export const shiftIcons = {
  MORNING: <Sun className="w-4 h-4 text-yellow-500" />,
  AFTERNOON: <SunMoon className="w-4 h-4 text-orange-500" />,
  EVENING: <Moon className="w-4 h-4 text-purple-500" />,
};

export const defaultShifts = ["MORNING", "AFTERNOON", "EVENING"];