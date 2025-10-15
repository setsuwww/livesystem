"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

import InputAssignUserShift from "./InputAssignUserShift"

import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select"
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader"
import ContentForm from "@/components/content/ContentForm"
import { ContentInformation } from "@/components/content/ContentInformation"

import { apiFetchData } from "@/function/helpers/fetch"

export default function CreateForm({ users, shifts }) {
  const [loading, setLoading] = useState(false)
  const [activeDate, setActiveDate] = useState(null)
  const [events, setEvents] = useState([])

  const [form, setForm] = useState({
    title: "",
    description: "",
    frequency: "ONCE",
  })

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = async (e) => { e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || events.length === 0) {
      toast.error("Please fill all required fields")
      return
    }

    setLoading(true)
    try { const userIds = Array.from(new Set(events.flatMap((e) => e.users.map((u) => u.id).filter(Boolean))))

      const payload = {
        title: form.title,
        description: form.description,
        frequency: form.frequency,
        startDate: events[0]?.startDate ?? null, endDate: events[0]?.endDate ?? null,
        startTime: events[0]?.startTime ?? null, endTime: events[0]?.endTime ?? null,
        userIds,
      }

      await apiFetchData({ url: "/schedules", method: "post", data: payload,
        successMessage: "Schedule created successfully",
        errorMessage: "Failed to create schedule",
      })

      setForm({ title: "", description: "", frequency: "ONCE" })
      setEvents([])
      setActiveDate(null)
    } 
    catch (error) { console.error("Error creating schedule:", error)} 
    finally { setLoading(false)}
  }

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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter schedule title"
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter schedule description"
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Select Frequency</Label>
              <Select
                value={form.frequency}
                onValueChange={(value) => handleChange("frequency", value)}
              >
                <SelectTrigger className="border-slate-200 focus:border-slate-400">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="ONCE">Once</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <InputAssignUserShift
              events={events}
              setEvents={setEvents}
              users={users}
              activeDate={activeDate}
              setActiveDate={setActiveDate}
            />

            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                {events.reduce((acc, e) => acc + e.users.length, 0)} users assigned •{" "}
                {events.length} dates scheduled
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
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
