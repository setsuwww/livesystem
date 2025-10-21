"use client"

import { useState } from "react"
import { Button } from "@/_components/ui/Button"
import { Label } from "@/_components/ui/Label"
import { Textarea } from "@/_components/ui/Textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/_components/ui/Select"
import { CalendarDays, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { apiFetchData } from "@/_function/helpers/fetch"

function toDateOnlyIso(s) {
  if (!s) return null
  const d = new Date(s)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export default function ChangeShiftForm({ employees = [] }) {
  const todayIso = toDateOnlyIso(new Date())

  const [selectedUser, setSelectedUser] = useState("")
  const [startDate, setStartDate] = useState(todayIso)
  const [endDate, setEndDate] = useState(todayIso)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const startDateObj = new Date(startDate + "T00:00:00")
  const endDateObj = new Date(endDate + "T00:00:00")
  const todayObj = new Date(todayIso + "T00:00:00")

  const startValid = startDateObj >= todayObj
  const endValid = !startDateObj || endDateObj >= startDateObj

  const disabled = loading || !selectedUser || !reason.trim() || !startValid || !endValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startValid) return toast.error("Start date must be today or later.")
    if (!endValid) return toast.error("End date must be same or after start date.")

  const target = employees.find((emp) => String(emp.id) === selectedUser)
  if (!target?.shiftId) return toast.error("Selected user has no shift assigned.")

  setLoading(true)
  try {
    const payload = {
      targetUserId: Number(target.id),
      newShiftId: target.shiftId, // shift target user
      startDate: new Date(startDate + "T00:00:00").toISOString(),
      endDate: endDate ? new Date(endDate + "T00:00:00").toISOString() : null,
      reason: reason.trim(),
    }

    await apiFetchData({
      url: "/shifts/user-side-change",
      method: "post",
      data: payload,
      successMessage: "Shift change request submitted successfully.",
      errorMessage: "Failed to submit shift change request.",
    })

    setSelectedUser("")
    setStartDate(todayIso)
    setEndDate(todayIso)
    setReason("")
  } catch (err) {
    console.error("Submit error:", err)
    }   finally {
      setLoading(false)
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl border border-slate-200"
    >
      {/* Employee select */}
      <div className="space-y-2">
        <Label>Select Employee</Label>
        <Select
          value={String(selectedUser)}
          onValueChange={(v) => setSelectedUser(String(v))}
          disabled={loading}
        >
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

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <div className="flex items-center gap-2">
            <CalendarDays className="text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-400 text-sm"
              min={todayIso}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>End Date (optional)</Label>
          <div className="flex items-center gap-2">
            <CalendarDays className="text-slate-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-400 text-sm"
              min={startDate || todayIso} 
            />
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <Label>Reason for Change</Label>
        <Textarea className="bg-white"
          placeholder="Explain why this shift change is needed..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={disabled}>
        {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
        Submit Request
      </Button>
    </form>
  )
}
