"use client";
import { useState } from "react";
import Link from 'next/link';
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import { capitalize } from "@/function/globalFunction";
import { shiftStyles, defaultShifts } from "@/constants/shiftConstants";
import { statusPriority, statusColorsClass } from "@/constants/attedanceConstants";

export function ShiftsCard({ shifts }) {
  const [selectedShift, setSelectedShift] = useState(null);

  const handleOpen = (shift) => setSelectedShift(shift);
  const handleClose = () => setSelectedShift(null);

  const uniqueShifts = defaultShifts
    .map((type) => shifts.find((s) => s.type === type))
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uniqueShifts.map((shift) => {
        const worstStatus =
          shift.users
            .map((u) => u.attendanceStatus)
            .filter((s) => s !== "PRESENT")
            .sort(
              (a, b) => statusPriority.indexOf(a) - statusPriority.indexOf(b)
            )[0] || "PRESENT";

        const presentCount = shift.users.filter(
          (u) => u.attendanceStatus === "PRESENT"
        ).length;

        return (
          <div key={shift.id} onClick={() => handleOpen(shift)}
            className="relative bg-white border border-slate-200 p-4 rounded-lg shadow-xs cursor-pointer transition">
            <div className="flex items-center justify-between mb-6 relative">
              <span className={`font-semibold text-sm px-2 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-600 relative`}>
                {capitalize(shift.type)}
                {worstStatus !== "PRESENT" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center">
                    <span className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${statusColorsClass[worstStatus].bgPing}`}></span>
                    <span className={`relative w-3 h-3 rounded-full ${statusColorsClass[worstStatus].bgDot}`}></span>
                  </span>
                )}
              </span>
              <Badge className={shiftStyles[shift.type]}>
                <span className="text-xs">
                  {shift.startTime} - {shift.endTime}
                </span>
              </Badge>
            </div>
            <footer className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="p-2 bg-slate-200 rounded-full">
                  <Users className="w-4 h-4" strokeWidth={2} />
                </div>
                <span className="text-slate-600 font-semibold">
                  {presentCount}/{shift.users.length}
                </span>{" "}
                Present
              </div>
              <Link className="text-sm text-blue-400 hover:text-blue-600" href={`/admin/dashboard/shifts/${shift.id}/users`}>
                See Employees
              </Link>
            </footer>
          </div>
        );
      })}

      {selectedShift && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl p-6 rounded-2xl shadow-lg border border-slate-200">
            <DialogHeader className="mb-6">
              <DialogTitle className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-slate-900">Shift Attendance</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Reviewed Shift:</span>
                  <Badge className={`${shiftStyles[selectedShift.type]} text-xs px-2 py-0.5`}>
                    {capitalize(selectedShift.type)}
                  </Badge>
                  <span className="text-sm text-slate-400">
                    {selectedShift.startTime} - {selectedShift.endTime}
                  </span>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {statusPriority.map((status) => {
                const users = selectedShift.users.filter(
                  (u) => u.attendanceStatus === status
                );
                if (!users.length) return null;

                return (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className={`${statusColorsClass[status].head} font-medium text-sm`}>
                        {capitalize(status)}
                      </h2>
                      <span className="text-xs text-slate-400">({users.length} Person)</span>
                    </div>

                    <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden bg-white">
                      {users.map((u) => (
                        <div key={u.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition">
                          <div className="flex flex-col">
                            <span className={`${statusColorsClass[status].text} text-sm font-medium`}>
                              {u.name}
                            </span>
                            <span className="text-xs text-slate-500">{u.email}</span>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${statusColorsClass[status].bgDot}`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <DialogFooter className="mt-6">
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full md:w-auto"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
