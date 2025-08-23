"use client"

import { useEffect, useState, useMemo, useCallback, useDeferredValue } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { fetch } from "@/function/helpers/fetch"

import { User } from "@/static/types/User"
import { CircleUserRound, Search } from "lucide-react"
import { Label } from "@/components/ui/Label"
import { shiftStyles } from "@/constants/shiftStyles"
import { ShiftType } from "@prisma/client"

interface SwitchUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: number | null
}

export const SwitchUserDialog = ({ open, onOpenChange, currentUserId }: SwitchUserDialogProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    if (open) {
      fetch<User[]>({
        url: "/users",
        method: "get",
        onSuccess: (data) => setUsers(data),
        errorMessage: "Failed to load users",
      })

      if (currentUserId) {
        fetch<User>({
          url: `/users/${currentUserId}`,
          method: "get",
          onSuccess: (data) => setCurrentUser(data),
          errorMessage: "Failed to load current user",
        })
      }
    }
  }, [open, currentUserId])

  const handleConfirm = useCallback(async () => {
    if (!selectedId || !currentUserId) return

    setLoading(true)
    try {
      await fetch({
        url: `/users/${currentUserId}/switch-shift`,
        method: "post",
        data: { otherUserId: selectedId },
        successMessage: "Shift swapped successfully",
        errorMessage: "Failed to swap shifts",
      })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }, [selectedId, currentUserId, onOpenChange])

  const filteredUsers = useMemo(() => {
    const query = deferredSearch.toLowerCase()
    return users.filter(
      (u) =>
        (u.id !== currentUserId && u.name.toLowerCase().includes(query)) ||
        u.email.toLowerCase().includes(query),
    )
  }, [users, currentUserId, deferredSearch])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap shift</DialogTitle>
        </DialogHeader>

        {currentUser && (
          <header>
            <Label htmlFor="past" className="mb-4">Current user</Label>
            <div className="flex items-center border border-zinc-300 rounded p-2 space-x-2 bg-zinc-50 text-zinc-500">
              <div className="p-2 rounded-lg bg-zinc-200">
                <CircleUserRound strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">{currentUser.name}</p>
                <p className="text-xs">{currentUser.email}</p>
              </div>
            </div>
          </header>
        )}

        <Label htmlFor="search">Search & switch user</Label>
        <div className="relative mb-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 border border-zinc-300 rounded p-2">
          {filteredUsers.length === 0 ? (
            <p className="text-xs text-center text-zinc-400">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-x-3 cursor-pointer border border-zinc-200 p-2 rounded"
              >
                <Checkbox
                  checked={selectedId === user.id}
                  onCheckedChange={() => setSelectedId(user.id)}
                />

                <span className="flex flex-col text-sm">
                  <span className="text-sm font-semibold text-zinc-700">{user.name}</span>
                  <span
                    className={
                      user.shift?.type
                        ? shiftStyles[user.shift.type]
                        : shiftStyles[ShiftType.OFF]
                    }
                  >
                    {user.shift?.type ?? "OFF"}
                  </span>
                  <span className="text-xs text-zinc-400">{user.email}</span>
                </span>
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!selectedId || loading} onClick={handleConfirm}>
            {loading ? "Swapping..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
