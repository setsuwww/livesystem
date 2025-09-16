"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { ScrollArea } from "@/components/ui/Scroll-area"
import { UserCircle } from "lucide-react"
import { ShiftAssignedUsersSearch } from "./ShiftAssignedUsersSearch"

export function ShiftAssignedUsersModal({ shift }) {
  const [filteredUsers, setFilteredUsers] = useState(shift.users || [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-blue-600 hover:text-blue-400">
          View details
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex flex-col text-lg font-semibold text-zinc-700">
            <span className="text-zinc-600">Assigned Users</span>
            <span className="text-base text-zinc-400">{shift.shiftName || shift.type} at {shift.startTime} - {shift.endTime}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <ShiftAssignedUsersSearch
            users={shift.users || []}
            onFilter={setFilteredUsers}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {filteredUsers?.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 border border-zinc-200 p-2 rounded-xl">
                <div className="p-2 bg-zinc-200 rounded-lg">
                  <UserCircle className="text-zinc-500" size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-zinc-600">{user.name}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </div>
            ))}

            {(!filteredUsers || filteredUsers.length === 0) && (
              <p className="text-sm text-zinc-400">No users found</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-zinc-600 mb-2">Related Schedules</h3>
            <ul className="space-y-2">
              {shift.schedules?.map((s) => (
                <li key={s.id} className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-sm font-semibold text-zinc-600">{s.title}</span>
                  <span className="text-xs text-zinc-500">
                    {new Date(s.startDate).toLocaleDateString()} →{" "}
                    {new Date(s.endDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
            {(!shift.schedules || shift.schedules.length === 0) && (
              <p className="text-sm text-zinc-400">No schedules found</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
