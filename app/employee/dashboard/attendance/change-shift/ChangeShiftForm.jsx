"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select"
import { format } from "date-fns"
import { CalendarDays, Loader2 } from "lucide-react"
import { toast } from "sonner"

function toDateOnlyIso(s) {
  // input "YYYY-MM-DD" or Date -> returns "YYYY-MM-DD"
  if (!s) return null
  const d = new Date(s)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function ChangeShiftForm({ employees = [] }) {
  // default start = today (YYYY-MM-DD)
  const todayIso = toDateOnlyIso(new Date())

  const [selectedUser, setSelectedUser] = useState("")
  const [startDate, setStartDate] = useState(todayIso)
  const [endDate, setEndDate] = useState(todayIso)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const startDateObj = startDate ? new Date(startDate + "T00:00:00") : null
  const endDateObj = endDate ? new Date(endDate + "T00:00:00") : null
  const todayObj = new Date(todayIso + "T00:00:00")

  const startValid = startDateObj && startDateObj >= todayObj // start must be today or future
  const endValid = endDateObj && (!startDateObj || endDateObj >= startDateObj)

  const disabled =
    loading ||
    !selectedUser ||
    !startDate ||
    !reason.trim() ||
    !startValid ||
    !endValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startValid) return toast.error("Start date must be today or in the future.")
    if (!endValid) return toast.error("End date must be same or after start date.")
    setLoading(true)

    try {
      const payload = {
        userId: Number(selectedUser),
        startDate: new Date(startDate + "T00:00:00").toISOString(),
        endDate: endDate ? new Date(endDate + "T00:00:00").toISOString() : null,
        reason: reason.trim(),
      }

      const res = await fetch("/api/shifts/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      let body = {}
      try { body = await res.json() } catch (err) { /* ignore parse err */ }

      if (!res.ok) {
        toast.error(body?.message || "Failed to submit shift change")
        console.error("Shift change error:", body)
        return
      }

      toast.success(body?.message || "Shift change request submitted")
      // reset
      setSelectedUser("")
      setStartDate(todayIso)
      setEndDate(todayIso)
      setReason("")
    } catch (err) {
      console.error("Network error:", err)
      toast.error("Network error, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md border">
      {/* Select Employee */}
      <div className="space-y-2">
        <Label>Select Employee</Label>
        <Select value={String(selectedUser)} onValueChange={(v) => setSelectedUser(String(v))}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={String(emp.id)}>
                {emp.name} — {emp.shift?.name || "No Shift"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Period - start & end */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date (default today)</Label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400"><CalendarDays /></span>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              min={todayIso}
            />
          </div>
          {!startValid && <p className="text-xs text-amber-600">Start must be today or later.</p>}
        </div>

        <div className="space-y-2">
          <Label>End Date (optional)</Label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400"><CalendarDays /></span>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              min={startDate || todayIso}
            />
          </div>
          {!endValid && <p className="text-xs text-amber-600">End date must be same or after start.</p>}
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <Label>Reason for Change</Label>
        <Textarea
          placeholder="Explain why this shift change is needed..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={disabled}>
        {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
        Submit Request
      </Button>
    </form>
  )
}
