"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Button } from "@/components/ui/Button"

export function DatePicker({ value, onChange }) {
  const [date, setDate] = React.useState(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-start text-left font-normal"
        >
          {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d)
            onChange?.(d)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
