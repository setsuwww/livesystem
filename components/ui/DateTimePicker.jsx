"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

export function DateTimePicker() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [hour, setHour] = React.useState("12")
  const [minute, setMinute] = React.useState("00")
  const [second, setSecond] = React.useState("00")

  return (
    <div className="flex flex-col gap-2">
      {/* Tanggal */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pilih tanggal"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Jam / Menit / Detik */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <Select value={hour} onValueChange={setHour}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }).map((_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={minute} onValueChange={setMinute}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 60 }).map((_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={second} onValueChange={setSecond}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 60 }).map((_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview hasil */}
      <Input
        readOnly
        value={
          date
            ? `${format(date, "yyyy-MM-dd")} ${hour}:${minute}:${second}`
            : ""
        }
      />
    </div>
  )
}
