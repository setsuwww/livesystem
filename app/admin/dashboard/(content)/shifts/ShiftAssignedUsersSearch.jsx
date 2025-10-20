"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/_components/ui/Input"
import { Popover, PopoverContent, PopoverTrigger } from "@/_components/ui/Popover"
import { Filter } from "lucide-react"

export function ShiftAssignedUsersSearch({ users = [], onFilter }) {
  const [value, setValue] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(value.toLowerCase()) ||
        u.email.toLowerCase().includes(value.toLowerCase())

      const matchesStatus = filter === "all" || u.status === filter
      return matchesSearch && matchesStatus
    })
  }, [users, value, filter])

  useEffect(() => { if (onFilter) onFilter(filteredUsers)
  }, [filteredUsers, onFilter])

  return (
    <div className="w-full max-w-md mb-4">
      <div className="group relative">
        {/* Input */}
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search..."
          className="group pl-14 caret-sky-500 focus-visible:ring-transparent focus-visible:border-sky-400 focus-visible:outline-none" // kasih padding kiri lebih gede biar ga mepet
        />

        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="text-slate-400 p-1 rounded-md hover:text-sky-600 hover:bg-sky-100 group-focus:text-sky-600">
                <Filter size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40" align="start">
              <div className="flex flex-col space-y-2 text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" value="all" checked={filter === "all"}
                    onChange={() => setFilter("all")}
                  />
                  <span>All</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" value="active" checked={filter === "active"}
                    onChange={() => setFilter("active")}
                  />
                  <span>Active</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" value="inactive" checked={filter === "inactive"}
                    onChange={() => setFilter("inactive")}
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </PopoverContent>
          </Popover>

          <div className="h-4 border-l border-slate-300" />
        </div>
      </div>
    </div>
  )
}
