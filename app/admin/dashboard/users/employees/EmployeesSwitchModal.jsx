"use client"

import React, { useState } from "react"
import { CircleUserRound, Search } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Checkbox } from "@/components/ui/Checkbox"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

import { fetch } from "@/function/helpers/fetch"
import { capitalize } from "@/function/globalFunction"
import { shiftStyles } from "@/constants/shiftConstants"

export const EmployeesSwitchModal = React.memo(function EmployeesSwitchModal({
  open,
  onOpenChange,
  currentUserId,
}) {
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState("")
  const queryClient = useQueryClient()

  const { data: currentUser, isLoading: loadingCurrent } = useQuery({
    queryKey: ["currentUser", currentUserId],
    queryFn: () =>
      fetch({
        url: `/users/${currentUserId}`,
        method: "get",
        errorMessage: "Failed to load current user",
      }),
    enabled: open && !!currentUserId,
  })

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["usersToSwitch", currentUserId],
    queryFn: () =>
      fetch({ url: `/users/${currentUserId}/switch`,
        method: "get",
        errorMessage: "Failed to load users",
      }),
    enabled: open && !!currentUserId,
  })

  const swapMutation = useMutation({
    mutationFn: () =>
      fetch({ url: `/users/${currentUserId}/switch`, method: "post", data: { otherUserId: selectedId },
        successMessage: "Shift swapped successfully",
        errorMessage: "Failed to swap shifts",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser", currentUserId] })
      await queryClient.invalidateQueries({ queryKey: ["usersToSwitch", currentUserId] })
      onOpenChange(false)
    },
  })

  const filteredUsers = users?.filter(
      (u) => u.id !== currentUserId &&
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    ) ?? []

  return (
    <Dialog open={open}
      onOpenChange={(val) => {
        if (!val) { setSelectedId(null)
          setSearch("")
        }
        onOpenChange(val)
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Swap shift</DialogTitle>
        </DialogHeader>

        {loadingCurrent ? (
          <p className="text-xs text-zinc-400">Loading current user...</p>
        ) : (
          currentUser && (
            <header>
              <Label htmlFor="past" className="mb-4">
                Current user
              </Label>
              <div className="flex items-center border border-zinc-300 rounded p-2 space-x-2 bg-zinc-100 text-zinc-600">
                <div className="p-2 rounded-full bg-zinc-300">
                  <CircleUserRound strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-700">{currentUser.name}</p>
                  <p className="text-xs">{currentUser.email}</p>
                </div>
              </div>
            </header>
          )
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
          {loadingUsers ? (
            <p className="text-xs text-center text-zinc-400">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-xs text-center text-zinc-400">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <label key={user.id} className="group flex items-center gap-x-3 cursor-pointer border border-zinc-200 px-4 py-2 rounded transition">
                <Checkbox checked={selectedId === user.id} onCheckedChange={() => setSelectedId(user.id)} />

                <div className="flex items-center gap-x-3 flex-1">
                  <div className="p-2 bg-zinc-100 group-hover:bg-sky-100 rounded-lg flex items-center justify-center transition">
                    <CircleUserRound
                      strokeWidth={1.5}
                      className="text-zinc-400 group-hover:text-sky-600 transition"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                    <div className="flex flex-col gap-x-2">
                      <p className="text-sm font-semibold text-zinc-700">{user.name}</p>
                      <p className="text-xs text-zinc-400 mt-1 sm:mt-0">{user.email}</p>
                    </div>

                    <p className={`px-2 py-0.5 rounded-md text-xs ${
                        shiftStyles[user.shift?.type ?? "bg-zinc-100"]
                      }`}
                    >
                      {capitalize(user.shift?.type ?? "OFF")}
                    </p>
                  </div>
                </div>
              </label>
            ))
          )}
        </section>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!selectedId || swapMutation.isPending} onClick={() => swapMutation.mutate()}>
            {swapMutation.isPending ? "Swapping..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})
