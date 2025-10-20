"use client"

import { useState, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"

import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader"

import { Button } from "@/_components/ui/Button"
import { Input } from "@/_components/ui/Input"
import { RadioButton } from "@/_components/ui/RadioButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/Select"
import ContentForm from "@/_components/content/ContentForm"
import { ContentInformation } from "@/_components/content/ContentInformation"
import { ContentList } from "@/_components/content/ContentList"
import { Label } from "@/_components/ui/Label"

import { createUser } from "@/_components/server/userAction.js"
import { capitalize, formatIntToTime } from "@/_function/globalFunction"
import { roleOptions } from "@/_constants/roleOptions"

export default function CreateForm({ offices, shifts }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    officeId: "",
    workMode: "WORK_HOURS",
    shiftId: "",
  })

  const [isPending, startTransition] = useTransition()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCustomChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([key, value]) => fd.append(key, value))

    startTransition(async () => {
      const res = await createUser(fd)
      if (res.success) router.push("/admin/dashboard/users")
    })
  }

  const selectedOffice = useMemo(
    () => offices.find(o => String(o.id) === form.officeId),
    [form.officeId, offices]
  )
  const defaultOfficeHour = useMemo(
    () => selectedOffice ? { startTime: selectedOffice.startTime, endTime: selectedOffice.endTime } : null,
    [selectedOffice]
  )
  const availableShifts = useMemo(() => selectedOffice?.shifts || [], [selectedOffice])

  return (
    <section>
      <DashboardHeader
        title="Create User"
        subtitle="Insert name, email, password, role, and work mode (shift or office hours)"
      />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Header */}
          <ContentForm.Header>
            <ContentInformation
              heading="Public"
              subheading="Users public username & email"
              show
              variant="outline"
              buttonText="Back"
              href="/admin/dashboard/users"
            />
          </ContentForm.Header>

          {/* Body */}
          <ContentForm.Body>
            <div className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-rose-500">*</span>
                </Label>
                <Input
                  placeholder="Username"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-rose-500">*</span>
                </Label>
                <Input
                  placeholder="Users email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <ContentInformation
                heading="Private"
                subheading="Users private password & role"
              />

              {/* Password */}
              <div className="space-y-2 mt-8">
                <Label htmlFor="password">
                  Password <span className="text-rose-500">*</span>
                </Label>
                <Input
                  placeholder="Users password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role <span className="text-rose-500">*</span></Label>
                <RadioButton
                  name="role"
                  options={roleOptions}
                  value={form.role}
                  onChange={(v) => handleCustomChange("role", v)}
                />
              </div>

              {/* Office */}
              <div className="space-y-2">
                <Label htmlFor="officeId">Office Assignment</Label>
                <Select
                  value={form.officeId}
                  onValueChange={(v) => handleCustomChange("officeId", v)}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select an Office" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">-</SelectItem>
                    {offices.map((o) => (
                      <SelectItem key={o.id} value={String(o.id)}>
                        {capitalize(o.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Work Mode */}
              <div className="space-y-2">
                <Label>Work Mode</Label>
                <RadioButton
                  name="workMode"
                  options={[
                    { label: "Work Hours", value: "WORK_HOURS" },
                    { label: "Shift Hours", value: "SHIFT" },
                  ]}
                  value={form.workMode}
                  onChange={(v) => handleCustomChange("workMode", v)}
                />
                <ContentList
                  type="i"
                  items={[
                    "Work Hours : follow the default office work startTime & endTime",
                    "Shift Hours : follow the shifts office work startTime & endTime",
                  ]}
                />
              </div>

              {/* Office Hours Display */}
              {form.workMode === "WORK_HOURS" && defaultOfficeHour && (
                <div className="p-3 rounded-md bg-muted/30 border text-sm">
                  <p>
                    <strong>Office Hours : </strong> {formatIntToTime(defaultOfficeHour.startTime)} - {formatIntToTime(defaultOfficeHour.endTime)}
                  </p>
                </div>
              )}

              {/* Shift Selection */}
              {form.workMode === "SHIFT" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="shiftId">Shift Assignment</Label>
                    <Select
                      value={form.shiftId}
                      onValueChange={(v) => handleCustomChange("shiftId", v)}
                      disabled={availableShifts.length === 0}
                    >
                      <SelectTrigger className="w-1/2">
                        <SelectValue
                          placeholder={
                            availableShifts.length === 0 ? "No shifts found" : "Select a Shift"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">-</SelectItem>
                        {availableShifts.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {capitalize(s.name)} ({formatIntToTime(s.startTime)} - {formatIntToTime(s.endTime)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {availableShifts.length === 0 && (
                    <ContentList
                      type="w"
                      items={["There is no shift detected or created in this Office to assign"]}
                    />
                  )}
                </>
              )}
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create User"}
            </Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  )
}
