"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { User, Mail, Briefcase, Clock, CalendarDays, Shield, LogIn, LogOut, Plane, Bell } from "lucide-react"
import { roleStyles } from "@/_constants/roleStyles"
import { Badge } from "@/_components/ui/Badge"
import { capitalize } from "@/_function/globalFunction"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [reason, setReason] = useState("")
  const [showPermission, setShowPermission] = useState(false)
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, <span className="text-sky-600">{user.name.split(" ")[0]}</span>
              </h1>
              <p className="text-slate-500 mt-1">Here's what's happening with your account today</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 mt-4">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="My Schedules"
            value="20"
            icon={<CalendarDays className="w-6 h-6" />}
            color="sky"
            trend="+2 this week"
          />
          <StatCard
            title="Notifications"
            value="10"
            icon={<Bell className="w-6 h-6" />}
            color="yellow"
            trend="3 unread"
          />
          <StatCard
            title="Attendance Rate"
            value="98%"
            icon={<Clock className="w-6 h-6" />}
            color="emerald"
            trend="Last 30 days"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    icon={<Mail className="w-5 h-5 text-slate-400" />}
                    label="Email Address"
                    value={user.email}
                  />
                  <InfoItem
                    icon={<Shield className="w-5 h-5 text-slate-400" />}
                    label="Role"
                    value={
                      <Badge className={roleStyles[user.role]}>
                        {capitalize(user.role)}
                      </Badge>
                    }
                  />
                  <InfoItem
                    icon={<Briefcase className="w-5 h-5 text-slate-400" />}
                    label="Office Location"
                    value={user.office?.name || "-"}
                  />
                  <InfoItem
                    icon={<Clock className="w-5 h-5 text-slate-400" />}
                    label="Work Shift"
                    value={user.shift?.name || "-"}
                  />
                  <InfoItem
                    icon={<CalendarDays className="w-5 h-5 text-slate-400" />}
                    label="Join Date"
                    value={new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <button
                    onClick={handleCheckIn}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Check In
                  </button>
                  <button
                    onClick={handleCheckOut}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Check Out
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  {!showPermission ? (
                    <button
                      onClick={() => setShowPermission(true)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plane className="w-4 h-4" />
                      Request Permission
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter your reason..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handlePermission}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setShowPermission(false)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500 text-center">
                    Last check-in: <span className="font-medium text-slate-700">Today, 08:15 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, trend }) {
  const colorClasses = {
    sky: "from-sky-300 to-sky-200 bg-sky-50 text-sky-700",
    yellow: "from-amber-100 to-amber-200 bg-amber-50",
    emerald: "from-emerald-100 to-emerald-200 bg-emerald-50"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
          <p className="text-xs text-slate-500">{trend}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-sm text-slate-900 font-medium pl-7">
        {value}
      </div>
    </div>
  )
}
