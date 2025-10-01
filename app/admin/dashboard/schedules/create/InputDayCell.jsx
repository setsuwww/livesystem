const DayCell = React.memo(({ date, event, shifts, updateShift }) => {
  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" })
  const dayNumber = new Date(date).getDate()

  return (
    <div className="flex flex-col items-center p-2">
      <div className="text-xxs text-zinc-500">{dayName}</div>
      <div className="text-base font-semibold text-zinc-700">{dayNumber}</div>

      <div className="space-y-1 w-full mt-1">
        <Select
          value={event.shiftId || "default"}
          onValueChange={(val) => updateShift(date, val, false)}
        >
          <SelectTrigger className={`w-full h-7 text-xs ${shiftStyles[shifts.find((s) => s.id.toString() === event.shiftId)?.type] || ""}`}>
            <SelectValue placeholder="Shift 1" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">No shift</SelectItem>
            {shifts.map((s) => (
              <SelectItem key={s.id} value={s.id.toString()}>{capitalize(s.type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={event.secondShiftId || "default"}
          onValueChange={(val) => updateShift(date, val, true)}
        >
          <SelectTrigger className={`w-full h-7 text-xs ${shiftStyles[shifts.find((s) => s.id.toString() === event.secondShiftId)?.type] || ""}`}>
            <SelectValue placeholder="Shift 2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">No second shift</SelectItem>
            {shifts.filter((s) => s.id.toString() !== event.shiftId).map((s) => (
              <SelectItem key={s.id} value={s.id.toString()}>{capitalize(s.type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
})
