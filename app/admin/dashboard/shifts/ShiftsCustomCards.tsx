import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, Clock9 } from "lucide-react";

interface ShiftCustomCardsProps {
  shifts: {
    id: number;
    customType: string | null;
    timeRange: string;
    users: { id: number; name: string }[];
  }[];
}

export function ShiftCustomCards({ shifts }: ShiftCustomCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shifts.map((shift) => (
        <Card key={shift.id} className="shadow-md border border-gray-300">
          <CardHeader className="flex items-center justify-between bg-gray-50 rounded-t-xl border-t border-gray-300">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-500" />
              {shift.customType || "Custom Shift"}
            </CardTitle>
            <div className="flex items-center space-x-1 text-sm text-green-500"> 
              <Clock9 strokeWidth={1.75} size={15} />
              <p>{shift.timeRange}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-sm mb-2">Users in this shift:</p>
            {shift.users.length > 0 ? (
              <ul className="space-y-2 list-none">
                {shift.users.map((u) => (
                  <li key={u.id} className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-35 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                    </span>
                    <span className="text-sm text-gray-800">{u.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No users assigned</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
