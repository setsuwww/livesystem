"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/Command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge"
import { ContentInformation } from '@/components/content/ContentInformation';
import { Check, ChevronsUpDown, CircleUserRound, X } from "lucide-react"

import { capitalize } from '@/function/globalFunction';

export default function InputAssignUserShift({
    events,
    setEvents,
    shifts,
    users,
    activeDate,
    setActiveDate,
}) {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [selectedShift, setSelectedShift] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [open, setOpen] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMessage, setDialogMessage] = useState("")
    const [dialogType, setDialogType] = useState("success")

    const toggleUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
        )
    }

    const setAllUsers = useCallback(() => {
        setSelectedUsers(users.map((u) => u.id))
    }, [users])

    const clearUsers = useCallback(() => {
        setSelectedUsers([])
    }, [])

    const generateRange = useCallback(() => {
        if (!startDate || !endDate || !selectedShift || selectedUsers.length === 0) return

        let current = new Date(startDate)
        const end = new Date(endDate)
        const newEvents = []

        while (current <= end) {
            const dateStr = current.toISOString().split("T")[0]
            newEvents.push({
                date: dateStr,
                shiftId: Number(selectedShift),
                users: users.filter((u) => selectedUsers.includes(u.id)),
                startDate,
                endDate,
            })
            current.setDate(current.getDate() + 1)
        }

        if (newEvents.length > 0) {
            setEvents((prev) => [...prev, ...newEvents])
            setDialogMessage(`✅ Successfully generated ${newEvents.length} schedule(s).`)
            setDialogType("success")
            setDialogOpen(true)
        }
        }, [startDate, endDate, selectedShift, selectedUsers, setEvents])

    return (
        <div className="space-y-6">

            <div className="py-2">
                <ContentInformation
                    heading="Assign Users to Shifts"
                    subheading="Pick a date range, select a shift, and assign multiple users"
                />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="flex flex-col space-y-2">
                    <Label>Start Date</Label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    {startDate && (
                        <span className="text-xs text-neutral-500">
                            {new Intl.DateTimeFormat("en-US", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            }).format(new Date(startDate))}
                        </span>
                    )}
                </div>

                {/* End Date */}
                <div className="flex flex-col space-y-2">
                    <Label>End Date</Label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    {endDate && (
                        <span className="text-xs text-neutral-500">
                            {new Intl.DateTimeFormat("en-US", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            }).format(new Date(endDate))}
                        </span>
                    )}
                </div>
            </div>

            {/* Shift Select */}
            <div className="flex flex-col space-y-2">
                <Label>Select Shift</Label>
                <Select value={selectedShift?.toString()} onValueChange={(val) => setSelectedShift(Number(val))}>
                    <SelectTrigger className="w-full md:w-[250px]">
                        <SelectValue placeholder="Select a shift" />
                    </SelectTrigger>
                    <SelectContent>
                        {shifts.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                                {capitalize(s.type)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* User MultiSelect */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Assign Users</Label>
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={setAllUsers}>
                            Select All
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={clearUsers}
                            disabled={selectedUsers.length === 0}
                        >
                            Clear
                        </Button>
                    </div>
                </div>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between bg-white text-sm h-12"
                        >
                            <div className="flex flex-wrap gap-1.5 items-center min-h-[1.5rem]">
                                {selectedUsers.length > 0 ? (
                                    selectedUsers.map((id) => {
                                        const user = users.find((u) => u.id === id)
                                        return (
                                            <Badge
                                                key={id}
                                                variant="secondary"
                                                className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs px-2 py-0.5"
                                            >
                                                {user?.name}
                                                <span
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        toggleUser(id)
                                                    }}
                                                    className="cursor-pointer hover:bg-rose-100 rounded-md ml-1"
                                                >
                                                    <X className="h-3 w-3 text-rose-500 hover:text-rose-700" />
                                                </span>
                                            </Badge>
                                        )
                                    })
                                ) : (
                                    <span className="text-neutral-500">Select users...</span>
                                )}
                            </div>
                            <ChevronsUpDown className="h-4 w-4 text-neutral-500" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command className="bg-white">
                            <CommandInput placeholder="Search users..." className="h-10 text-sm" />
                            <CommandEmpty className="py-4 text-center text-sm text-neutral-500">
                                No users found.
                            </CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-y-auto">
                                {users.map((user) => {
                                    const isSelected = selectedUsers.includes(user.id)
                                    return (
                                        <CommandItem
                                            key={user.id}
                                            value={user.name}
                                            onSelect={() => toggleUser(user.id)}
                                            className="flex items-center justify-between py-2 px-4 hover:bg-neutral-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-neutral-100 rounded-lg">
                                                    <CircleUserRound className="h-5 w-5 text-neutral-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-neutral-700">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-neutral-400">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="bg-teal-100 p-1.5 rounded-md">
                                                    <Check className="h-4 w-4 text-teal-600" />
                                                </div>
                                            )}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Generate Button */}
            <div>
                <Button
                    type="button"
                    onClick={generateRange}
                    disabled={!startDate || !endDate || !selectedShift || selectedUsers.length === 0}
                    className="w-full md:w-auto"
                >
                    Generate Schedule
                </Button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-md border border-neutral-700 bg-neutral-900 text-neutral-100">
                    <DialogHeader>
                        <DialogTitle className={dialogType === "success" ? "text-teal-400" : "text-rose-400"}>
                            {dialogType === "success" ? "Success" : "Error"}
                        </DialogTitle>
                        <DialogDescription className="text-neutral-300">
                            {dialogMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
