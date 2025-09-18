"use client"

import { useState, useMemo, useCallback } from "react"
import { toast } from "sonner"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select"
import { ScrollArea } from "@/components/ui/Scroll-area"
import { DashboardHeader } from '@/app/admin/dashboard/DashboardHeader';
import ContentForm from '@/components/content/ContentForm';
import { ContentInformation } from '@/components/content/ContentInformation';

import { fetch } from "@/function/helpers/fetch"
import { shiftStyles } from '@/constants/shiftConstants';
import { roleStyles } from "@/constants/roleStyles"
import { capitalize } from "@/function/globalFunction"

export default function ScheduleForm({ users, shifts }) {
  const [loading, setLoading] = useState(false)
  const [activeDate, setActiveDate] = useState(null)
  const [form, setForm] = useState({
    title: "",
    description: "",
    frequency: "ONCE",
    userIds: [],
  })

  const [events, setEvents] = useState([])

  const handleDateSelect = useCallback((info) => { const date = info.startStr
    setEvents((prev) => { if (!prev.find((e) => e.date === date)) {
        return [...prev, { date, shiftId: "", secondShiftId: "" }]
      }
      return prev
    })
  }, [])

  const updateShift = useCallback((date, shiftId, isSecondShift = false) => {
    setEvents((prev) =>
      prev.map((e) => { if (e.date === date) { if (isSecondShift) {
            return { ...e, secondShiftId: shiftId }
          } 
          else {
            return { ...e, shiftId, secondShiftId: "" }
          }
        }
        return e
      }),
    )
  }, [])

  const setAllShift = useCallback((shiftId) => { const targetShift = shifts.find((s) => s.id === shiftId)
      if (!targetShift) return

      setEvents((prev) =>
        prev.map((e) => {
          if (e.shiftId && e.shiftId !== shiftId.toString()) { const existingShift = shifts.find((s) => s.id.toString() === e.shiftId)
            if (existingShift && existingShift.type !== targetShift.type) {
              return e
            }
          }

          if (e.secondShiftId && e.secondShiftId !== shiftId.toString()) { const existingSecondShift = shifts.find((s) => s.id.toString() === e.secondShiftId)
            if (existingSecondShift && existingSecondShift.type !== targetShift.type) {
              return { ...e, shiftId: shiftId.toString() }
            }
          }

          return { ...e, shiftId: shiftId.toString(), secondShiftId: "" }
        }),
      )
    },
    [shifts],
  )

  const getAvailableSecondShifts = useCallback(
    (firstShiftId) => { if (!firstShiftId) return shifts
      return shifts.filter((s) => s.id.toString() !== firstShiftId)
    },
    [shifts],
  )

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleUser = useCallback((id) => { setForm((prev) => { const exists = prev.userIds.includes(id)
      return {...prev, userIds: exists ? prev.userIds.filter((u) => u !== id) : [...prev.userIds, id]}
    })
  }, [])

  const setAllUsers = useCallback(() => {
    setForm((prev) => ({ ...prev, userIds: users.map((u) => u.id) }))
  }, [users])

  const clearUsers = useCallback(() => {
    setForm((prev) => ({ ...prev, userIds: [] }))
  }, [])

  const handleSubmit = async (e) => { e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || form.userIds.length === 0 || events.length === 0) {
      toast.error("Please fill all required fields")
      return
    }

    setLoading(true)
    try { const response = await fetch("/api/schedules", { method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          userIds: form.userIds,
          dates: events.filter((e) => e.shiftId)
            .map((e) => ({
              date: e.date,
              shiftId: e.shiftId,
              secondShiftId: e.secondShiftId || null,
            })),
        }),
      })

      if (!response.ok) { throw new Error("Failed to create schedule")}

      const result = await response.json()
      toast.success("Schedule created successfully")

      setForm({
        title: "",
        description: "",
        frequency: "ONCE",
        userIds: [],
      })
      setEvents([])
      setActiveDate(null)
    } 
    catch (error) { console.error("Error creating schedule:", error)
      toast.error("Failed to create schedule")
    } 
    finally {
      setLoading(false)
    }
  }

  const memoizedUsers = useMemo(() => users, [users])
  const memoizedShifts = useMemo(() => shifts, [shifts])

  return (
    <section>
      <DashboardHeader title="Create Schedules" subtitle="Manage schedules data" />

      <ContentForm>
      <ContentForm.Header>
        <ContentInformation
          heading="Schedule Form"
          subheading="Create a new schedule and assign users"
        />
      </ContentForm.Header>
      <ContentForm.Body>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-700">
              Title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter schedule title"
              className="border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-700">
              Description
            </Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter schedule description"
              className="border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency" className="text-zinc-700">
            Select Frequency
          </Label>
          <Select value={form.frequency} onValueChange={(value) => handleChange("frequency", value)}>
            <SelectTrigger id="frequency" className="w-full mt-1 border-zinc-200 focus:border-zinc-400">
              <SelectValue placeholder="Select Frequency" />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200">
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
              <SelectItem value="ONCE">Once</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-zinc-700">Assign Users</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm"
                onClick={setAllUsers}
              >
                Select all users
              </Button>
              <Button type="button" variant="destructive" size="sm" onClick={clearUsers}
                disabled={form.userIds.length === 0}
              >
                Clear all
              </Button>
            </div>
          </div>

          <ScrollArea className="h-64 w-full border border-zinc-200 rounded-lg p-2 bg-zinc-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {memoizedUsers.map((user) => {
                const isSelected = form.userIds.includes(user.id)
                return (
                  <Card key={user.id} className={`p-3 cursor-pointer transition-all duration-200 border ${
                      isSelected ? "border-zinc-300"
                        : "border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm"
                      }`}
                    onClick={() => toggleUser(user.id)}
                  >
                    <div>
                      <div className="flex flex-col space-x-2">
                        <p className="text-sm font-medium text-zinc-900">{user.name}</p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div> 
                    </div>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Calendar */}
        <div className="space-y-4">
          <Label className="text-zinc-700">Pick Dates & Assign Shifts</Label>

          <div className="border border-zinc-200 rounded-xl p-6 bg-white shadow-sm">
            <FullCalendar plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true} select={handleDateSelect}
              height="auto" headerToolbar={{
                left: "prev next today",
                center: "title",
                right: "",
              }}
              dayCellContent={(args) => {
  const date = args.date.toISOString().split("T")[0]
  const event = events.find((e) => e.date === date)
  const isActive = activeDate === date
  const dayName = args.date.toLocaleDateString("en-US", { weekday: "short" })

  const renderShifts = () => (
    <div className="flex flex-col space-y-1 w-full">
      {event?.shiftId && (
        <Badge className={`w-full flex items-center justify-center ${shiftStyles[memoizedShifts.find((s) => s.id.toString() === event.shiftId)?.type]}`}>
          {capitalize(memoizedShifts.find((s) => s.id.toString() === event.shiftId)?.type || "")}
        </Badge>
      )}
      {event?.secondShiftId && (
        <Badge className={`w-full flex items-center justify-center ${shiftStyles[memoizedShifts.find((s) => s.id.toString() === event.secondShiftId)?.type]}`}>
          {capitalize(memoizedShifts.find((s) => s.id.toString() === event.secondShiftId)?.type || "")}
        </Badge>
      )}
      {!event?.shiftId && !event?.secondShiftId && (
        <span className="text-xs text-zinc-400 font-medium">Click to add</span>
      )}
    </div>
  )

  return (
    <div
      className={`flex flex-col items-center justify-start cursor-pointer p-3 rounded-lg transition-all transform
        ${isActive
          ? "bg-white border-2 border-zinc-200 shadow-md scale-[1.02]"
          : "hover:scale-[0.98] hover:bg-white/50 backdrop-blur-md border border-transparent hover:border-zinc-300"
        }`}
      onClick={() => setActiveDate(isActive ? null : date)}
    >
      <div className="text-center mb-2">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{dayName}</div>
        <div className="text-lg font-semibold text-zinc-700">{args.dayNumberText}</div>
      </div>

      {isActive ? (
        <div className="space-y-2 w-full">
          <Select
            value={event?.shiftId || "default"}
            onValueChange={(val) => updateShift(date, val, false)}
          >
            <SelectTrigger className="w-full h-8 text-xs border-zinc-200 bg-white">
              <SelectValue placeholder="Shift 1" />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200">
              <SelectItem value="default">No shift</SelectItem>
              {memoizedShifts.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {capitalize(s.type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {event?.shiftId && (
            <Select
              value={event?.secondShiftId || "default"}
              onValueChange={(val) => updateShift(date, val, true)}
            >
              <SelectTrigger className="w-full h-8 text-xs border-zinc-200 bg-white">
                <SelectValue placeholder="Shift 2" />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-200">
                <SelectItem value="default">No second shift</SelectItem>
                {getAvailableSecondShifts(event.shiftId).map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {capitalize(s.type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ) : (
        renderShifts()
      )}
    </div>
  )
}}

            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-zinc-700">Quick assign to all dates:</span>
            {memoizedShifts.map((s) => (
              <Button key={s.id} type="button" variant="outline" size="sm" onClick={() => setAllShift(s.id)}
                className="capitalize border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
              >
                Set all to {s.type}
              </Button>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setEvents([])} disabled={events.length === 0}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              Clear all dates
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
          <div className="text-sm text-zinc-600">
            {form.userIds.length} users selected • {events.length} dates scheduled
          </div>
          <div className="flex items-center space-x-2">
            <Button type="button" variant="outline" disabled={loading}
              className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800 text-white">
              {loading ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        </div>
      </form>
      </ContentForm.Body>
      </ContentForm>
    </section>
  )
}
