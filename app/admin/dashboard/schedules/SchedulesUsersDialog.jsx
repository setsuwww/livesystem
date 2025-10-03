"use client";

import { useState } from "react";
import { CalendarClock, PenSquareIcon } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

import { capitalize } from "@/function/globalFunction";
import { frequencyStyles } from "@/constants/frequencyStyles";

export default function ScheduleUsersDialog({ users, schedules }) {
  const [open, setOpen] = useState(false);

  if (!users || users.length === 0) {
    return <span className="text-xs text-neutral-400">No users assigned</span>;
  }

  const limitedUsers = users.slice(0, 4);
  const hasMore = users.length > 4;

  return (
    <div className="flex flex-col gap-1 mt-2">
      {limitedUsers.map((u) => (
        <div key={u.user.id} className="flex items-center justify-between text-xs pb-1 border-b border-neutral-100">
          <span className="text-sm font-semibold text-neutral-400 rounded-md">
            {u.user.name}
          </span>
          <span className="text-xs text-sky-400">{u.user.email}</span>
        </div>
      ))}

      {hasMore && (
        <>
          <button size="sm" className="text-left mt-2 text-xs text-blue-600" onClick={() => setOpen(true)}>
            View Details
          </button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>All Assigned Users</DialogTitle>
              </DialogHeader>

              <div className="flex items-center space-x-3">
                <div className ={`p-0 rounded-lg bg-transparent ${frequencyStyles[capitalize(schedules.frequency)]}`}>
                  <CalendarClock strokeWidth={1.5} size={24} />
                </div>
                <h1 className="text-md font-bold text-neutral-600">{schedules.title}</h1>
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-2 mt-2">
                {users.map((u) => (
                  <div key={u.user.id} className="flex items-center justify-between text-sm border-b py-1">
                    <span className="flex items-center space-x-1 font-semibold text-neutral-600">
                      <span className="text-sky-500 hover:bg-sky-100 p-1 hover:text-sky-700">
                        <PenSquareIcon className="w-4 h-4" />
                      </span>
                      <span>{u.user.name}</span>
                    </span>
                    <span className="text-neutral-400">{u.user.email}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
