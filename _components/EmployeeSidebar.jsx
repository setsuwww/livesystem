"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Clock,
  CalendarDays,
  QrCode,
  User,
  LogOut,
  Inbox,
  RefreshCcw,
} from "lucide-react"
import SubHeading from "./content/SubHeading"
import { cn } from "@/_lib/utils"

const linkBase =
  "flex items-center gap-2 text-md px-3 py-2 rounded-lg transition-colors"

function SidebarLink({ href, icon: Icon, children }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        linkBase,
        isActive
          ? "bg-sky-100 text-sky-700"
          : "text-slate-600 hover:bg-sky-100 hover:text-sky-700"
      )}
    >
      <Icon size={18} />
      {children}
    </Link>
  )
}

export default function EmployeeSidebar({ employee }) {
  return (
    <aside className="w-64 h-screen bg-white font-semibold flex flex-col border-r border-slate-200">
      <div className="text-2xl font-bold px-7 text-sky-800 py-6 border-b border-slate-200">
        Live<span className="text-sky-600">system.</span>
      </div>

      <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-sky-50/50">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-300 shadow-sm">
          {employee?.image ? (
            <Image
              src={employee.image}
              alt={employee.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-slate-200 text-slate-700 border border-slate-200 font-bold">
              {employee?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800">
            {employee?.name || "Employee"}
          </span>
          <span className="text-xs text-slate-500 truncate max-w-[150px]">
            {employee?.email || "user@example.com"}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SubHeading title="Attendance" />
        <SidebarLink
          href="/employee/dashboard/attendance/checkin"
          icon={QrCode}
        >
          Attendances
        </SidebarLink>
        <SidebarLink href="/employee/dashboard/attendance/history" icon={Clock}>
          History
        </SidebarLink>

        <SubHeading title="Calendar" />
        <SidebarLink
          href="/employee/dashboard/attendance/change-shift"
          icon={RefreshCcw}
        >
          Change Shift
        </SidebarLink>
        <SidebarLink
          href="/employee/dashboard/my-schedules"
          icon={CalendarDays}
        >
          My Schedule
        </SidebarLink>
        <SidebarLink href="/employee/dashboard/inbox" icon={Inbox}>
          Inbox
        </SidebarLink>

        <SubHeading title="Account" />
        <SidebarLink href="/employee/dashboard/profile" icon={User}>
          Profile
        </SidebarLink>
        <SidebarLink href="/logout" icon={LogOut}>
          Logout
        </SidebarLink>
      </nav>
    </aside>
  )
}
