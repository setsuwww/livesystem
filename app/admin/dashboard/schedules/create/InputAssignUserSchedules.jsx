"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/Command"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover"
import { Badge } from "@/components/ui/Badge"
import { Check, ChevronsUpDown, X } from "lucide-react"

export default function InputAssignUserSchedules({ users, form, setForm }) {
  const [open, setOpen] = useState(false)

  const toggleUser = useCallback(
    (id) => {
      setForm((prev) => {
        const exists = prev.userIds.includes(id)
        return {
          ...prev,
          userIds: exists
            ? prev.userIds.filter((u) => u !== id)
            : [...prev.userIds, id],
        }
      })
    },
    [setForm]
  )

  const setAllUsers = useCallback(() => {
    setForm((prev) => ({ ...prev, userIds: users.map((u) => u.id) }))
  }, [setForm, users])

  const clearUsers = useCallback(() => {
    setForm((prev) => ({ ...prev, userIds: [] }))
  }, [setForm])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-zinc-800">
          Assign Users
        </Label>
        <div className="flex gap-2">
          <Button type="button"
            variant="outline"
            size="sm"
            onClick={setAllUsers}
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={clearUsers}
            disabled={form.userIds.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Select Input */}
      <Popover open={open} onOpenChange={setOpen} className="hover:bg-none hover:border-none">
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open}
            className="w-full justify-between bg-white hover:bg-transparent text-sm font-normal h-12"
          >
            <div className="flex flex-wrap gap-1.5 items-center min-h-[1.5rem]">
              {form.userIds.length > 0 ? (
                form.userIds.map((id) => {
                  const user = users.find((u) => u.id === id)
                  return (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1.5 bg-zinc-50 border-0 border-b-2 border-zinc-300 shadow-xs text-zinc-800 font-medium px-2 py-1">
                      {user?.name}
                      <X className="h-3.5 w-3.5 cursor-pointer text-red-500 hover:text-red-700" 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleUser(id)
                        }}
                      />
                    </Badge>
                  )
                })
              ) : (
                <span className="text-zinc-500">Select users...</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 text-zinc-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command className="bg-white">
            <CommandInput
              placeholder="Search users..."
              className="h-10 text-sm"
            />
            <CommandEmpty className="py-4 text-center text-sm text-zinc-500">
              No users found.
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {users.map((user) => {
                const isSelected = form.userIds.includes(user.id)
                return (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    onSelect={() => toggleUser(user.id)}
                    className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-800">
                        {user.name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {user.email}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}