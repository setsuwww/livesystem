"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import { capitalize } from "@/function/globalFunction";
import { shiftStyles } from "@/constants/shiftStyles";

// Mapping warna untuk Tailwind
const statusColorsClass = {
  PRESENT: { bgPing: "bg-green-400", bgDot: "bg-green-400", text: "text-green-500" },
  ABSENT: { bgPing: "bg-red-400", bgDot: "bg-red-400", text: "text-red-500" },
  LATE: { bgPing: "bg-yellow-400", bgDot: "bg-yellow-400", text: "text-yellow-500" },
  PERMISSION: { bgPing: "bg-blue-400", bgDot: "bg-blue-400", text: "text-blue-500" },
};

// Urutan prioritas status
const statusPriority = ["ABSENT", "LATE", "PERMISSION", "PRESENT"];

export function ShiftCards({ shifts }) {
  const [selectedShift, setSelectedShift] = useState(null);

  const handleOpen = (shift) => setSelectedShift(shift);
  const handleClose = () => setSelectedShift(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shifts.map((shift) => {
        // Tentukan worstStatus berdasarkan prioritas
        const worstStatus =
          shift.users
            .map((u) => u.attendanceStatus)
            .sort((a, b) => statusPriority.indexOf(a) - statusPriority.indexOf(b))[0] || "PRESENT";

        const presentCount = shift.users.filter((u) => u.attendanceStatus === "PRESENT").length;

        return (
          <div
            key={shift.id}
            className="relative bg-white border border-zinc-200 p-4 rounded-xl shadow-xs cursor-pointer transition"
            onClick={() => handleOpen(shift)}
          >
            <div className="flex items-center justify-between mb-6 relative">
              <span className={`font-semibold text-sm px-2 py-1 rounded-lg bg-none ${shiftStyles[shift.type]} relative`}>
                {capitalize(shift.type)}
                {/* Dot ping di pojok kanan atas label */}
                {worstStatus !== "PRESENT" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center">
                    <span className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${statusColorsClass[worstStatus].bgPing}`}></span>
                    <span className={`relative w-3 h-3 rounded-full ${statusColorsClass[worstStatus].bgDot}`}></span>
                  </span>
                )}
              </span>
              <Badge className="flex items-center space-x-2 bg-zinc-100 border-zinc-300 text-zinc-700">
                <span className="text-xs">
                  {shift.startTime} - {shift.endTime}
                </span>
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-zinc-600">
              <div className="p-2 bg-zinc-200 rounded-lg">
                <Users className="w-4 h-4" strokeWidth={2} />
              </div>
              <span className="text-zinc-600 font-semibold">{presentCount}/{shift.users.length}</span> Present
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
                      <span className={`${statusColorsClass[status].text} font-semibold`}>
                        {capitalize(status)} ({users.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {users.map((u) => (
                        <div key={u.id} className="bg-zinc-50 rounded-r-md p-2 flex flex-col border-0 border-l-3 border-gray-300">
                          <span className="text-sm font-semibold text-zinc-600">{u.name}</span>
                          <span className="text-xs text-zinc-400">{u.email}</span>
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
