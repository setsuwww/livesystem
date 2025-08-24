"use client";
import { useEffect, useState, useMemo, useCallback, useDeferredValue } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { fetch } from "@/function/helpers/fetch"

import { CircleUserRound, Search } from "lucide-react"
import { Label } from "@/components/ui/Label"
import { shiftStyles } from "@/constants/shiftStyles"
import { capitalize } from "@/function/handleTime";

export const EmployeesSwitchModal = ({
  open,
  onOpenChange,
  currentUserId
}) => {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    if (open) {
      fetch({
        url: "/users",
        method: "get",
        onSuccess: (data) => setUsers(data),
        errorMessage: "Failed to load users",
      })

      if (currentUserId) {
        fetch({
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
        url: `/users/${currentUserId}/switch`,
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
            <div className="flex items-center border border-zinc-300 rounded p-2 space-x-2 bg-zinc-100 text-zinc-600">
              <div className="p-2 rounded-lg bg-zinc-300">
                <CircleUserRound strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-700">{currentUser.name}</p>
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

        <section className="max-h-60 overflow-y-auto space-y-2 border border-zinc-100 shadow-xs rounded-lg p-2">
          {filteredUsers.length === 0 ? (
            <p className="text-xs text-center text-zinc-400">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <label key={user.id} className="flex items-center gap-x-3 cursor-pointer border border-zinc-200 p-2 rounded hover:bg-zinc-50 transition">
                <Checkbox checked={selectedId === user.id} onCheckedChange={() => setSelectedId(user.id)}/>

                <div className="flex items-center gap-x-3 flex-1">
                  <div className="p-2 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <CircleUserRound strokeWidth={1.5} className="text-zinc-400" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-2">
                      <p className="text-sm font-semibold text-zinc-700">{user.name}</p>
                      <p className={`px-2 py-0.5 rounded-md text-xs ${shiftStyles[user.shift?.type ?? "bg-gray-100"]}`}>
                        {capitalize(user.shift?.type ?? "OFF")}
                      </p>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1 sm:mt-0">{user.email}</p>
                  </div>
                </div>
              </label>
            ))
          )}
        </section>

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
