"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_components/ui/Dialog"
import { ScrollArea } from "@/_components/ui/Scroll-area"
import { CalendarDays, CircleUserRound, UserCircle } from "lucide-react"
import { ShiftAssignedUsersSearch } from "./ShiftAssignedUsersSearch"
import { Badge } from "@/_components/ui/Badge"
import { shiftStyles } from "@/_constants/shiftConstants"

export function ShiftAssignedUsersModal({ shift }) {
  const [filteredUsers, setFilteredUsers] = useState(shift.users || [])

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-blue-600 hover:text-blue-400">
          View details
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex flex-col space-y-2 text-lg font-semibold text-slate-700">
            <div className="flex items-center space-x-2">
              <h4 className={`p-2 rounded-lg ${shiftStyles[shift.type]}`}>
                <CircleUserRound strokeWidth={1.5} />
              </h4>
              <p className="flex space-x-2">
                <span className="text-slate-600">Assigned Users </span>
                <span className="text-slate-400">{shift.name || shift.type}</span>
              </p>
            </div>
            <Badge className={shiftStyles[shift.type]}>{shift.startTime} - {shift.endTime}</Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="pb-2 border-b border-0 border-slate-200">
            <ShiftAssignedUsersSearch
              users={shift.users || []}
              onFilter={setFilteredUsers}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6">
            {filteredUsers?.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 border border-slate-200 p-2 rounded-lg">
                <div className="p-2 bg-slate-200 rounded-lg text-slate-500">
                  <UserCircle size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-slate-600">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
            ))}

            {(!filteredUsers || filteredUsers.length === 0) && (
              <p className="text-sm text-slate-400">No users found</p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className={`p-2 rounded-lg ${shiftStyles[shift.type]}`}>
                <CalendarDays strokeWidth={1.5} />
              </div>
              <h4 className="text-base font-semibold text-slate-600">Related Schedules</h4>
            </div>
            <ul className="space-y-2 px-2">
              {shift.schedules?.map((s) => (
                <li key={s.id} className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-sm font-semibold text-slate-600">{s.title}</span>
                  <span className="text-xs text-slate-400">
                    <span className="text-teal-400">{formatDateTime(s.startDate)}</span>
                    {` - `}
                    <span className="text-rose-400">{formatDateTime(s.endDate)}</span>
                  </span>
                </li>
              ))}
            </ul>
            {(!shift.schedules || shift.schedules.length === 0) && (
              <p className="text-sm text-slate-400">No schedules found</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
