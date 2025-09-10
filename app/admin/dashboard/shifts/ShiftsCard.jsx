"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import { capitalize } from "@/function/globalFunction";
import { shiftStyles } from "@/constants/shiftStyles";
import { statusColorsClass } from "@/constants/attedancesStyles";

// Urutan prioritas status
const statusPriority = ["ABSENT", "LATE", "PERMISSION"];

export function ShiftCards({ shifts }) {
  const [selectedShift, setSelectedShift] = useState(null);

  const handleOpen = (shift) => setSelectedShift(shift);
  const handleClose = () => setSelectedShift(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shifts.map((shift) => { const worstStatus =
        shift.users
          .map((u) => u.attendanceStatus)
          .filter((s) => s !== "PRESENT")
          .sort((a, b) => statusPriority.indexOf(a) - statusPriority.indexOf(b))[0] || "PRESENT";
        const presentCount = shift.users.filter((u) => u.attendanceStatus === "PRESENT").length;

        return (
          <div key={shift.id} onClick={() => handleOpen(shift)}
            className="relative bg-white border border-zinc-200 p-4 rounded-xl shadow-xs cursor-pointer transition"
          >
            <div className="flex items-center justify-between mb-6 relative">
              <span className={`font-semibold text-sm px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-300 text-zinc-600 relative`}>
                {capitalize(shift.type)}
                {worstStatus !== "PRESENT" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center">
                    <span className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${statusColorsClass[worstStatus].bgPing}`}></span>
                    <span className={`relative w-3 h-3 rounded-full ${statusColorsClass[worstStatus].bgDot}`}></span>
                  </span>
                )}
              </span>
              <Badge className={shiftStyles[shift.type]}>
                <span className="text-xs">{shift.startTime} - {shift.endTime}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <div className="p-2 bg-zinc-200 rounded-full">
                <Users className="w-4 h-4" strokeWidth={2} />
              </div>
              <span className="text-zinc-600 font-semibold">
                {presentCount}/{shift.users.length}
              </span>{" "}
              Present
            </div>
          </div>
        );
      })}

      {selectedShift && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <div>
                  <span>Detail attendance</span>
                  <div className="flex items-center mt-4 gap-2">
                    <h1 className="text-sm text-zinc-500">Reviewed shift</h1>
                    <Badge className={shiftStyles[selectedShift.type]}>
                      {capitalize(selectedShift.type)}
                    </Badge>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {statusPriority.map((status) => {
                const users = selectedShift.users.filter((u) => u.attendanceStatus === status);
                if (!users.length) return null;

                return (
                  <div key={status}>
                    <div className="flex items-center gap-1 mb-2">
                      <span className={`${statusColorsClass[status].head} font-semibold`}>
                        {capitalize(status)} ({users.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {users.map((u) => (
                        <div
                          key={u.id}
                          className={`${statusColorsClass[status].border} rounded-r-md p-2 flex flex-col border-0 border-l-3`}
                        >
                          <span className={`${statusColorsClass[status].text} text-sm font-semibold`}>{u.name}</span>
                          <span className={`${statusColorsClass[status].subtext} text-xs`}>{u.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <DialogFooter className="mt-6 flex justify-end">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
