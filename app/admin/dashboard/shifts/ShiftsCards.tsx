import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, Clock9, CircleUserRound } from "lucide-react";
import { AttendanceStatus, ShiftType } from "@prisma/client";

interface ShiftCardsProps {
  shifts: {
    id: number;
    type: ShiftType;
    timeRange: string;
    users: {
      id: number;
      name: string;
      email: string;
      attendance?: {
        status: AttendanceStatus;
        checkInAt?: Date | null;
      } | null;
    }[];
  }[];
}

export function ShiftCards({ shifts }: ShiftCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shifts.map((shift) => (
        <Card
          key={shift.id}
          className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white"
        >
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900">
              <div className="bg-sky-100 text-sky-500 p-2 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              {shift.type}
            </CardTitle>
            <div className="flex items-center space-x-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full border border-green-300">
              <Clock9 strokeWidth={1.5} size={15} />
              <p>{shift.timeRange}</p>
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-base text-sm text-neutral-700 mb-2">
              Users in this shift
            </p>

            {shift.users.length > 0 ? (
              <>
                <ul className="space-y-3">
                  {shift.users.slice(0, 3).map((u) => (
                    <li key={u.id} className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-700">
                        {u.name}
                      </span>
                      <span className="text-xs text-zinc-500">{u.email}</span>
                      {u.attendance && (
                        <span
                          className={`text-xs mt-1 ${
                            u.attendance.status === "ON_TIME"
                              ? "text-green-600"
                              : u.attendance.status === "LATE"
                              ? "text-orange-500"
                              : u.attendance.status === "ABSENT"
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {u.attendance.status}
                          {u.attendance.checkInAt &&
                            ` at ${new Date(
                              u.attendance.checkInAt
                            ).toLocaleTimeString()}`}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {shift.users.length > 3 && (
                  <button className="mt-3 text-xs text-blue-600 hover:underline">
                    View Details
                  </button>
                )}
              </>
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
