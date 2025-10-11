'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock, CalendarDays, QrCode, User, LogOut, Inbox, RefreshCcw } from 'lucide-react'
import SubHeading from './content/SubHeading'

const linkBase = "flex items-center gap-2 text-md px-3 py-2 rounded-lg transition-colors"

function SidebarLink({ href, icon: Icon, children }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`${linkBase} ${ isActive ? 'bg-sky-100 text-sky-700'
        : 'text-slate-600 hover:bg-sky-100 hover:text-sky-700'
    }`}>
      <Icon size={18} />
      {children}
    </Link>
  )
}

export function EmployeeSidebar({ employee }) {
  return (
    <aside className="w-64 h-screen bg-white font-semibold flex flex-col border-0 border-r-2 border-slate-200">
      <div className='text-2xl font-bold px-7 text-sky-800 py-6 border-b border-slate-200'>
        Live<span className="text-sky-600">system.</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SubHeading title="Attendance" />
        <SidebarLink href="/employee/dashboard/attendance/checkin" icon={QrCode}>Attendances</SidebarLink>
        <SidebarLink href="/employee/dashboard/attendance/history" icon={Clock}>History</SidebarLink>

        <SubHeading title="Calendar" />

        <SidebarLink href="/employee/dashboard/attendance/change-shift" icon={RefreshCcw}>Change Shift</SidebarLink>
        <SidebarLink href="/employee/dashboard/my-schedules" icon={CalendarDays}>My Schedule</SidebarLink>
        <SidebarLink href="/employee/dashboard/inbox" icon={Inbox}>Inbox</SidebarLink>

        <SubHeading title="Account" />
        <SidebarLink href="/employee/dashboard/profile" icon={User}>Profile</SidebarLink>
        <SidebarLink href="/logout" icon={LogOut}>Logout</SidebarLink>
      </nav>
    </aside>
  )
}
