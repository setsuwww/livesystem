"use client"

import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { User, Mail, Briefcase, Clock, CalendarDays, Shield, LogIn, LogOut, Plane } from "lucide-react"
import { roleStyles } from "@/_constants/roleStyles"
import { Badge } from "@/_components/ui/Badge"
import { capitalize } from "@/_function/globalFunction"
import { userSendCheckIn, userSendCheckOut, userSendPermissionRequest } from "@/_components/server/attendanceAction"
import { apiFetchData } from '@/_function/helpers/fetch';

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [reason, setReason] = useState("")
  const [showPermission, setShowPermission] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetchData({
          url: "/me",              
          successMessage: "User data loaded!",
          errorMessage: "Failed to load user data",
        })

        setUser(data)
      } catch (err) {
        console.error("Failed to fetch user:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleCheckIn = () =>
    startTransition(async () => {
      const result = await userSendCheckIn()
      if (result?.error) toast.error(result.error)
      else toast.success("Checked in successfully")
    })

  const handleCheckOut = () =>
    startTransition(async () => {
      const result = await userSendCheckOut()
      if (result?.error) toast.error(result.error)
      else toast.success("Checked out successfully")
    })

  const handlePermission = () =>
    startTransition(async () => {
      const result = await userSendPermissionRequest(reason)
      if (result?.error) toast.error(result.error)
      else {
        toast.success("Permission request sent")
        setReason("")
        setShowPermission(false)
      }
    })

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
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
            <div className="bg-slate-200 px-6 py-4 border-b border-slate-300">
              <h2 className="text-lg font-semibold text-slate-600 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={<Mail className="w-5 h-5 text-slate-400" />} label="Email Address" value={user.email} />
                <InfoItem
                  icon={<Shield className="w-5 h-5 text-slate-400" />}
                  label="Role"
                  value={<Badge className={roleStyles[capitalize(user.role)]}>{capitalize(user.role)}</Badge>}
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
                    year: "numeric",
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
                  disabled={isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                >
                  <LogIn className="w-4 h-4" />
                  Check In
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={isPending}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
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
                        disabled={isPending || !reason.trim()}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:opacity-60"
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
            </div>
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
      <div className="text-sm text-slate-900 font-medium pl-7">{value}</div>
    </div>
  )
}
