import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, Clock9 } from "lucide-react";

interface ShiftCustomCardsProps {
  shifts: {
    id: number;
    customType?: string | null;
    timeRange: string;
    users: { id: number; name: string }[];
  }[];
}

export function ShiftCustomCards({ shifts }: ShiftCustomCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shifts.map((shift) => (
        <Card key={shift.id} className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {/* Header */}
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
              <Calendar className="w-5 h-5 text-sky-500" />
              {shift.customType || "Custom Shift"}
            </CardTitle>
            <div className="flex items-center space-x-1 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full border border-green-300">
              <Clock9 strokeWidth={1.5} size={15} />
              <p>{shift.timeRange}</p>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent>
            <p className="font-medium text-sm text-neutral-700 dark:text-neutral-300 mb-2">
              Users in this shift
            </p>
            {shift.users.length > 0 ? (
              <ul className="space-y-2">
                {shift.users.map((u) => (
                  <li key={u.id} className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-40 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    <span className="text-sm text-neutral-800 dark:text-neutral-200">
                      {u.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-400 dark:text-neutral-600">
                No users assigned
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
