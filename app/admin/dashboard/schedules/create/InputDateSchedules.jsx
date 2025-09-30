"use client"

import { useCallback } from "react"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { capitalize } from "@/function/globalFunction"
import { shiftStyles } from "@/constants/shiftConstants"
import { Trash2, X } from "lucide-react"

export default function InputDateSchedules({
  events,
  setEvents,
  activeDate,
  setActiveDate,
  shifts,
}) {
  const handleDateSelect = useCallback(
    (info) => {
      let current = new Date(info.start)
      const end = new Date(info.end)
      const newEvents = []

      while (current < end) {
        const dateStr = current.toISOString().split("T")[0]
        if (!events.find((e) => e.date === dateStr)) {
          newEvents.push({ date: dateStr, shiftId: "", secondShiftId: "" })
        }
        current.setDate(current.getDate() + 1)
      }

      if (newEvents.length > 0) {
        setEvents((prev) => [...prev, ...newEvents])
      }
    },
    [events, setEvents]
  )

  const updateShift = useCallback(
    (date, shiftId, isSecondShift = false) => {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.date === date) {
            if (isSecondShift) {
              return { ...e, secondShiftId: shiftId }
            } else {
              return { ...e, shiftId, secondShiftId: shiftId ? "" : e.secondShiftId }
            }
          }
          return e
        })
      )
    },
    [setEvents]
  )

  const removeDate = useCallback(
    (date) => {
      setEvents((prev) => prev.filter((e) => e.date !== date))
      if (activeDate === date) {
        setActiveDate(null)
      }
    },
    [setEvents, activeDate, setActiveDate]
  )

  const setAllShift = useCallback(
    (shiftId) => {
      const shiftIdStr = shiftId.toString()

      if (events.length === 0) return

      // Ambil bulan & tahun dari event pertama
      const sampleDate = new Date(events[0].date)
      const year = sampleDate.getFullYear()
      const month = sampleDate.getMonth()

      // Cari total hari di bulan itu
      const lastDay = new Date(year, month + 1, 0).getDate()

      // Generate semua tanggal dalam bulan tsb
      const allDatesInMonth = Array.from({ length: lastDay }, (_, i) => {
        const day = String(i + 1).padStart(2, "0")
        const monthStr = String(month + 1).padStart(2, "0")
        return `${year}-${monthStr}-${day}`
      })

      // Apply shift ke semua tanggal
      const newEvents = allDatesInMonth.map((date) => ({
        date,
        shiftId: shiftIdStr,
        secondShiftId: "",
      }))

      setEvents(newEvents)
    },
    [events, setEvents]
  )

  const getAvailableSecondShifts = useCallback(
    (firstShiftId) => {
      if (!firstShiftId) return shifts
      return shifts.filter((s) => s.id.toString() !== firstShiftId)
    },
    [shifts]
  )

  return (
    <div className="space-y-4">
      <Label className="text-zinc-700 text-base font-medium">Pick Dates & Assign Shifts</Label>

      <div className="border border-zinc-200 rounded-xl p-6 bg-white shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          select={handleDateSelect}
          height="auto"
          headerToolbar={{
            left: "prev next today",
            center: "title",
            right: "",
          }}
          buttonText={{ today: "Today" }}
          dayCellContent={(args) => {
            const date = args.date.toISOString().split("T")[0]
            const event = events.find((e) => e.date === date)
            const isActive = activeDate === date
            const dayName = args.date.toLocaleDateString("en-US", {
              weekday: "short",
            })

            const renderShifts = () => (
              <div className="flex flex-col space-y-1 w-full">
                {event?.shiftId && (
                  <Badge
                    className={`w-full flex items-center justify-center text-xs font-medium py-1 ${shiftStyles[
                      shifts.find((s) => s.id.toString() === event.shiftId)?.type
                    ]}`}
                  >
                    {capitalize(
                      shifts.find((s) => s.id.toString() === event.shiftId)?.type || ""
                    )}
                  </Badge>
                )}
                {event?.secondShiftId && (
                  <Badge
                    className={`w-full flex items-center justify-center text-xs font-medium py-1 ${shiftStyles[
                      shifts.find((s) => s.id.toString() === event.secondShiftId)?.type
                    ]}`}
                  >
                    {capitalize(
                      shifts.find((s) => s.id.toString() === event.secondShiftId)?.type || ""
                    )}
                  </Badge>
                )}
                {!event?.shiftId && !event?.secondShiftId && event && (
                  <span className="text-xs text-zinc-400 font-medium text-center">
                    No shift assigned
                  </span>
                )}
              </div>
            )

            return (
              <div
                className={`flex flex-col items-center justify-start cursor-pointer p-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? "bg-white border-2 border-zinc-300 shadow-md scale-105 z-10"
                    : event
                      ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 hover:scale-102"
                      : "hover:bg-zinc-50 hover:border-zinc-200 hover:scale-102"
                  }`}
                onClick={() => {
                  if (event) {
                    setActiveDate(isActive ? null : date)
                  } else {
                    setEvents((prev) => [...prev, { date, shiftId: "", secondShiftId: "" }])
                    setActiveDate(date)
                  }
                }}
              >
                <div className="text-center mb-2">
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    {dayName}
                  </div>
                  <div className="text-lg font-semibold text-zinc-700">
                    {args.dayNumberText}
                  </div>
                </div>

                {isActive ? (
                  <div className="space-y-2 w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveDate(null)
                      }}
                      className="ml-auto flex items-center justify-center rounded-full p-1 hover:bg-red-100 transition-colors"
                    >
                      <X className="h-4 w-4 text-zinc-500 hover:text-red-700" />
                    </button>
                    <Select
                      value={event?.shiftId || "default"}
                      onValueChange={(val) => updateShift(date, val, false)}
                    >
                      <SelectTrigger className="w-full h-9 text-sm border-zinc-200 bg-white">
                        <SelectValue placeholder="Select Shift 1" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200 max-h-60 overflow-y-auto">
                        <SelectItem value="default">No shift</SelectItem>
                        {shifts.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {capitalize(s.type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {event?.shiftId && event.shiftId !== "default" && (
                      <Select
                        value={event?.secondShiftId || "default"}
                        onValueChange={(val) => updateShift(date, val, true)}
                      >
                        <SelectTrigger className="w-full h-9 text-sm border-zinc-200 bg-white">
                          <SelectValue placeholder="Select Shift 2" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-zinc-200 max-h-60 overflow-y-auto">
                          <SelectItem value="default">No second shift</SelectItem>
                          {getAvailableSecondShifts(event.shiftId).map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                              {capitalize(s.type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="w-full h-9 text-sm"
                      onClick={() => removeDate(date)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Date
                    </Button>
                  </div>
                ) : (
                  renderShifts()
                )}
              </div>
            )
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-zinc-700">
          Apply Preset to All Selected Dates:
        </span>
        <div className="flex items-center space-x-3 justify-between">
          <div className="flex space-x-2">
            {shifts.map((s) => (
              <Button
                key={s.id}
                onClick={() => setAllShift(s.id)}
                type="button"
                size="sm"
                className={`${shiftStyles[s.type]} hover:opacity-80 transition-opacity shadow-sm border border-zinc-300`}
                disabled={events.length === 0}
              >
                All {capitalize(s.type)}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEvents([])}
            disabled={events.length === 0}
            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-colors"
          >
            Clear All Dates
          </Button>
        </div>
      </div>
    </div>
  )
}