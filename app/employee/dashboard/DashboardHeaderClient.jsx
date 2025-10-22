"use client"

import { LogOut, CalendarDays } from "lucide-react"
import { capitalize } from "@/_function/globalFunction"
import dayjs from "dayjs"
import "dayjs/locale/en"

dayjs.locale("en")

export default function DashboardHeaderClient({ user }) {
  const today = dayjs().format("dddd, D MMMM YYYY")

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <header className="w-full flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-100">
      <div>
        <div className="flrx flex-col text-slate-600">
          <h1 className="text-xl md:text-2xl font-semibold"><span className="text-sky-700">{capitalize(user?.name ?? "User")}’s</span> Dashboard</h1>
          <span className="text-sm">{user?.email ?? "User@gmail.com"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2 bg-white px-4 py-1 rounded-lg border border-slate-200 text-sm text-slate-600">
          <CalendarDays size={14} />
          <span>{today}</span>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm flex items-center gap-2 px-4 py-1 rounded-lg bg-white text-red-500 border border-slate-200 transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
