"use client"

import { useState, useMemo, useCallback } from "react"
import { toast } from "sonner"

import InputAssignUserSchedules from "./InputAssignUserSchedules"
import InputDateSchedules from "./InputDateSchedules"

import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select"
import { DashboardHeader } from '@/app/admin/dashboard/DashboardHeader';
import ContentForm from '@/components/content/ContentForm';
import { ContentInformation } from '@/components/content/ContentInformation';

import { fetch } from "@/function/helpers/fetch"

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

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || form.userIds.length === 0 || events.length === 0) {
      toast.error("Please fill all required fields")
      return
    }

    setLoading(true)
    try {
      const result = await fetch({
        url: "/schedules",
        method: "post",
        data: {
          title: form.title,
          description: form.description,
          frequency: form.frequency,
          userIds: form.userIds,
          dates: events.filter((e) => e.shiftId).map((e) => ({
            date: e.date,
            shiftId: e.shiftId,
            secondShiftId: e.secondShiftId || null,
          })),
        },
        successMessage: "Schedule created successfully",
        errorMessage: "Failed to create schedule",
      })

      // reset form
      setForm({
        title: "",
        description: "",
        frequency: "ONCE",
        userIds: [],
      })
      setEvents([])
      setActiveDate(null)
    }
    catch (error) {
      console.error("Error creating schedule:", error)
    }
    finally {
      setLoading(false)
    }

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

            <InputAssignUserSchedules users={users} form={form} setForm={setForm} />

            <InputDateSchedules
              events={events}
              setEvents={setEvents}
              activeDate={activeDate}
              setActiveDate={setActiveDate}
              shifts={shifts}
            />

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
