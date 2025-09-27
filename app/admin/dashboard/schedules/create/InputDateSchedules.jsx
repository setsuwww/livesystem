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

export default function InputDateSchedules({
  events, setEvents,
  activeDate, setActiveDate,
  shifts,
}) {
  const handleDateSelect = useCallback(
    (info) => {
      const date = info.startStr
      setEvents((prev) => {
        if (!prev.find((e) => e.date === date)) {
          return [...prev, { date, shiftId: "", secondShiftId: "" }]
        }
        return prev
      })
    },
    [setEvents]
  )

  const updateShift = useCallback(
    (date, shiftId, isSecondShift = false) => {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.date === date) {
            if (isSecondShift) {
              return { ...e, secondShiftId: shiftId }
            } else {
              return { ...e, shiftId, secondShiftId: "" }
            }
          }
          return e
        })
      )
    },
    [setEvents]
  )

  const setAllShift = useCallback(
    (shiftId) => {
      const targetShift = shifts.find((s) => s.id === shiftId)
      if (!targetShift) return

      setEvents((prev) =>
        prev.map((e) => {
          return { ...e, shiftId: shiftId.toString(), secondShiftId: "" }
        })
      )
    },
    [shifts, setEvents]
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
      <Label className="text-zinc-700">Pick Dates & Assign Shifts</Label>

      <div className="border border-zinc-200 rounded-xl p-6 bg-white shadow-sm">
        <FullCalendar plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true} select={handleDateSelect}
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
                    className={`w-full flex items-center justify-center ${shiftStyles[
                      shifts.find((s) => s.id.toString() === event.shiftId)?.type
                    ]
                      }`}
                  >
                    {capitalize(
                      shifts.find((s) => s.id.toString() === event.shiftId)?.type || ""
                    )}
                  </Badge>
                )}
                {event?.secondShiftId && (
                  <Badge
                    className={`w-full flex items-center justify-center ${shiftStyles[
                      shifts.find((s) => s.id.toString() === event.secondShiftId)?.type
                    ]
                      }`}
                  >
                    {capitalize(
                      shifts.find((s) => s.id.toString() === event.secondShiftId)?.type || ""
                    )}
                  </Badge>
                )}
                {!event?.shiftId && !event?.secondShiftId && (
                  <span className="text-xs text-zinc-400 font-medium">
                    Click to add
                  </span>
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
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    {dayName}
                  </div>
                  <div className="text-lg font-semibold text-zinc-700">
                    {args.dayNumberText}
                  </div>
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
                        {shifts.map((s) => (
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

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-700">
          Preset:
        </span>
        <div className="flex items-center space-x-2 justify-between">
          <span className="space-x-2">
            {shifts.map((s) => (
              <Button key={s.id} type="button" size="sm" onClick={() => setAllShift(s.id)}
                className={`${shiftStyles[s.type]} hover:opacity-50 shadow-none border-1`}
              >
                {capitalize(s.type)}
              </Button>
            ))}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={() => setEvents([])} disabled={events.length === 0}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            Clear all dates
          </Button>
        </div>
      </div>
    </div>
  )
}
