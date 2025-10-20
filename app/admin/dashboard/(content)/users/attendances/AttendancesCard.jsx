"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/_components/ui/Dialog";
import { Button } from "@/_components/ui/Button";
import { Badge } from "@/_components/ui/Badge";

import { capitalize } from "@/_function/globalFunction";
import { statusColorsClass } from "@/_constants/attedanceConstants";

export function AttendancesCard({ shifts }) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const handleOpen = (status) => setSelectedStatus(status);
  const handleClose = () => setSelectedStatus(null);

  // 3 kategori card default
  const defaultStatuses = ["ABSENT", "LATE", "PERMISSION"];

  // Hitung user per status di semua shift
  const statusSummary = defaultStatuses.map((status) => {
    const users = shifts.flatMap((shift) => shift.users)
      .filter((u) => u.attendanceStatus === status);
    return { status, users };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusSummary.map(({ status, users }) => (
        <div key={status} onClick={() => handleOpen(status)}
          className="relative bg-white border border-slate-200 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition"
        >
          {/* Dot Ping Notifikasi */}
          {users.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center">
              <span className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${statusColorsClass[status].bgPing}`}></span>
              <span className={`relative w-3 h-3 rounded-full ${statusColorsClass[status].bgDot}`}></span>
            </span>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className={`font-semibold px-2 py-1 rounded-lg ${statusColorsClass[status].head}`}>
              {capitalize(status)}
            </span>
            <Badge className={`text-xs border-0 ${statusColorsClass[status].bgDot}`}>
              {users.length} Person
            </Badge>
          </div>

          <footer className="flex items-center gap-2 text-sm text-slate-600">
            <div className="p-2 bg-slate-200 rounded-full">
              <Users className="w-4 h-4" strokeWidth={2} />
            </div>
            <span className="font-semibold">{users.length} Person</span>
          </footer>
        </div>
      ))}

      {selectedStatus && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl p-6 rounded-2xl shadow-lg border border-slate-200">
            <DialogHeader className="mb-6">
              <DialogTitle className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-slate-900">Attendance Detail</span>
                <span className="text-sm text-slate-400">
                  {shifts.flatMap(s => s.users).filter(u => u.attendanceStatus === selectedStatus).length} Employees
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              {shifts.map((shift) => {
                const usersInShift = shift.users.filter(u => u.attendanceStatus === selectedStatus);
                if (!usersInShift.length) return null;

                return (
                  <div key={shift.id} className="border rounded-lg overflow-hidden bg-white">
                    <div className="px-4 py-2 font-medium bg-slate-50 border-b text-slate-800">
                      {shift.type} - {shift.officeName || "-"}
                    </div>
                    {usersInShift.map(u => (
                      <div key={u.id} className="px-4 py-3 flex justify-between transition">
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-600">{u.name}</span>
                            <div className={`w-2 h-2 rounded-full ${statusColorsClass[selectedStatus].bgDot}`}></div>
                          </div>
                          <span className="text-xs text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            <DialogFooter className="mt-6">
              <Button onClick={handleClose} variant="outline" className="w-full md:w-auto">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
