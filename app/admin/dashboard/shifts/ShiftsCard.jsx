"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, Clock } from "lucide-react";
import { capitalize, formatTimeRange } from "@/function/helpers/timeHelpers";
import { shiftStyles } from "@/constants/shiftStyles";

const statusColors = {
  PRESENT: "green",
  ABSENT: "red",
  LATE: "yellow",
  PERMISSION: "blue",
};

export function ShiftCards({ shifts }) {
  const [selectedShift, setSelectedShift] = useState(null);

  const handleOpen = (shift) => setSelectedShift(shift);
  const handleClose = () => setSelectedShift(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shifts.map((shift) => { const worstStatus = shift.users
            .map((u) => u.attendanceStatus)
            .sort((a, b) =>
                ["ABSENT", "LATE", "PERMISSION", "PRESENT"].indexOf(a) -
                ["ABSENT", "LATE", "PERMISSION", "PRESENT"].indexOf(b)
            )[0] || "PRESENT";

        const presentCount = shift.users.filter((u) => u.attendanceStatus === "PRESENT").length;

        return (
          <div key={shift.id} className="relative bg-white border border-zinc-200 p-4 rounded-xl shadow-xs cursor-pointer transition" onClick={() => handleOpen(shift)}>
            {worstStatus !== "PRESENT" && (
              <div className={`absolute top-3 right-3 w-3 h-3 rounded-full bg-${statusColors[worstStatus]}-500`}></div>
            )}
            <div className="vertical-space justify-between mb-6">
              <span className={`font-semibold text-sm px-2 py-1 rounded-lg bg-none ${shiftStyles[shift.type]}`}>{capitalize(shift.type)}</span>
              <Badge className="vertical-space space-x-2 bg-green-100 border-green-300 text-green-700">
                <span className="text-xs">{formatTimeRange(shift.startTime, shift.endTime)}</span>
              </Badge>
            </div>
            <div className="vertical-space gap-1 text-sm text-zinc-600">
              <div className="p-2 bg-gray-200 rounded-lg">
                <Users className="w-4 h-4" strokeWidth={2} />
              </div>
              <span className="text-zinc-600 font-semibold">{presentCount}/{shift.users.length}</span>Present
            </div>
          </div>
        );
      })}

      {selectedShift && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedShift.type} Shift - Attendance Detail</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {["ABSENT", "LATE", "PERMISSION", "PRESENT"].map((status) => {
                const users = selectedShift.users.filter((u) => u.attendanceStatus === status);
                if (!users.length) return null;

                return (
                  <div key={status}>
                    <div className="vertical-space gap-1 mb-2">
                      <Badge className={`w-3 h-3 rounded-full bg-${statusColors[status]}-500`} />
                      <span className={`font-semibold text-${statusColors[status]}-600`}>
                        {status} ({users.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {users.map((u) => (
                        <div key={u.id} className="bg-gray-50 rounded p-2 flex justify-between">
                          <span>{u.name}</span>
                          <span className="text-xs text-gray-500">{u.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <DialogFooter className="mt-6 flex justify-end">
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}