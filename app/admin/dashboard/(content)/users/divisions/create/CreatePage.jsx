"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/_components/ui/Button"
import { Input } from "@/_components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/Select"
import { Label } from "@/_components/ui/Label"

import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader"
import ContentForm from "@/_components/content/ContentForm"
import { ContentInformation } from "@/_components/content/ContentInformation"

import { typeOptions, statusOptions } from "@/_constants/divisionConstants"
import { capitalize, timeToMinutes } from "@/_function/globalFunction"
import { Loader } from "lucide-react"
import { createDivision } from "@/_components/server/divisionAction"

export default function CreateDivisionForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "", location: "", longitude: "", latitude: "",
    radius: "", type: "WFO", status: "INACTIVE",
    startTime: "", endTime: "",
  })
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleChange = (e) => { const { name, value } = e.target 
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {e.preventDefault()
    setLoading(true)

    const payload = {...form,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      radius: form.radius ? parseInt(form.radius) : null,
      startTime: form.startTime ? timeToMinutes(form.startTime) : null,
      endTime: form.endTime ? timeToMinutes(form.endTime) : null,
    }

    startTransition(async () => {
      const result = await createDivision(payload)
      setLoading(false)

      if (result.success) { alert(result.message)
        router.push("/admin/dashboard/divisions")
      } 
      else { alert(result.message)}
    })
  }

  return (
    <section>
      <DashboardHeader
        title="Create division"
        subtitle="Fill in division details to register a new division location"
      />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-2">
          <ContentForm.Header>
            <ContentInformation heading="Division Info" subheading="Division details & location"
              show={true} variant="outline" buttonText="Back" href="/admin/dashboard/users/divisions"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-rose-500">*</span>
                </Label>
                <Input name="name" placeholder="Head division"
                  value={form.name} onChange={handleChange} required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-rose-500">*</span>
                </Label>
                <Input name="location" placeholder="Jakarta"
                  value={form.location} onChange={handleChange} required
                />
              </div>

              <ContentInformation heading="Division Coordinates" subheading="Insert latitude and longitude for active division location"/>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="longitude">
                    Longitude<span className="text-rose-500">*</span>
                  </Label>
                  <Input name="longitude" placeholder="106.8456"
                    value={form.longitude} onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">
                    Latitude<span className="text-rose-500">*</span>
                  </Label>
                  <Input name="latitude" placeholder="-6.2088"
                    value={form.latitude} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="radius">
                  Radius (meter)<span className="text-rose-500">*</span>
                </Label>
                <Input name="radius" placeholder="100"
                  value={form.radius} onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Start Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input type="time" name="startTime"
                    value={form.startTime} onChange={handleChange} required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">
                    End Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input type="time" name="endTime"
                    value={form.endTime} onChange={handleChange} required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Type<span className="text-rose-500">*</span>
                  </Label>
                  <Select value={form.type} onValueChange={(value) => handleCustomChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Status<span className="text-rose-500">*</span>
                  </Label>
                  <Select value={form.status} onValueChange={(value) => handleCustomChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {capitalize(opt.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <Button type="submit" disabled={loading || isPending}>
              {loading || isPending 
                ? (<><Loader className="w-4 h-4 animate-spin" /> Creating...</>) 
                : ("Create Division")
              }
            </Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  )
}
