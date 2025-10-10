"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { User, Mail, Briefcase, Clock, CalendarDays, Shield, LogIn, LogOut, Plane } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [reason, setReason] = useState("")
  const [showPermission, setShowPermission] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) throw new Error("Failed to fetch user")
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load user data")
      }
    }
    fetchUser()
  }, [])

  const handleCheckIn = async () => {
    try {
      const res = await fetch("/api/attendance/checkin", { method: "POST" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Checked in successfully")
    } catch {
      toast.error("Check in failed")
    }
  }

  const handleCheckOut = async () => {
    try {
      const res = await fetch("/api/attendance/checkout", { method: "POST" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Checked out successfully")
    } catch {
      toast.error("Check out failed")
    }
  }

  const handlePermission = async () => {
    try {
      const res = await fetch("/api/attendance/permission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Permission request sent")
      setReason("")
      setShowPermission(false)
    } catch {
      toast.error("Permission failed to send")
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-600">
        <Clock className="w-6 h-6 animate-spin mb-2" />
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto px-2 md:px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-700">
          Welcome,{" "}
          <span className="text-sky-600">{user.name.split(" ")[0]}</span>
        </h1>
        <p className="bg-white border border-slate-300 px-4 py-1.5 rounded-lg flex items-center space-x-2 text-sm text-slate-500">
        <CalendarDays size={16}/>
        <span >
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="bg-sky-100 p-2 rounded-full">
                <User className="w-5 h-5 text-sky-500" />
              </div>
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <InfoRow icon={<Mail size={20} />} label="Email" value={user.email} />
            <InfoRow
              icon={<Shield size={20} />}
              label="Role"
              value={
                <Badge
                  variant="outline"
                  className="border-sky-400 text-sky-600 bg-sky-50"
                >
                  {user.role}
                </Badge>
              }
            />
            <InfoRow
              icon={<Briefcase size={20} />}
              label="Office"
              value={user.office?.name || "-"}
            />
            <InfoRow
              icon={<Clock size={20} />}
              label="Shift"
              value={user.shift?.name || "-"}
            />
            <InfoRow
              icon={<CalendarDays size={20} />}
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </CardContent>
        </Card>

        {/* Attendance Card */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Clock className="w-5 h-5 text-green-500" />
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Check In / Out */}
            <div className="flex gap-2">
              <Button
                onClick={handleCheckIn}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                <LogIn className="w-4 h-4 mr-1" /> Check In
              </Button>
              <Button
                onClick={handleCheckOut}
                className="flex-1 bg-sky-600 hover:bg-sky-700"
              >
                <LogOut className="w-4 h-4 mr-1" /> Check Out
              </Button>
            </div>

            {/* Permission */}
            {!showPermission ? (
              <Button
                onClick={() => setShowPermission(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                <Plane className="w-4 h-4 mr-1" /> Request Permission
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Enter reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handlePermission}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPermission(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-1">
      <div className="flex items-center gap-2 text-slate-600">
        <span className="text-slate-400">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="font-medium text-slate-800">{value}</div>
    </div>
  )
}
