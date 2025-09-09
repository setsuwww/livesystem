'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock, CalendarDays, ChevronUp, ChevronDown, User, LogOut } from 'lucide-react'
import SubHeading from './content/SubHeading'

const linkBase = "flex items-center gap-2 text-md px-3 py-2 rounded-lg transition-colors"

function SidebarLink({ href, icon: Icon, children }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`${linkBase} ${ isActive ? 'bg-sky-100 text-sky-700'
        : 'text-zinc-600 hover:bg-sky-100 hover:text-sky-700'
    }`}>
      <Icon size={18} />
      {children}
    </Link>
  )
}

export function EmployeeSidebar({ employee }) {
  return (
    <aside className="w-64 h-screen bg-white font-semibold flex flex-col border-0 border-r-2 border-zinc-200">
      <div className="px-8 py-4 border-b border-zinc-200 flex flex-col items-center">
        <Image src="/images/lintasarta.webp" width={120} height={120} alt="Lintasarta" />
        <p className="mt-2 text-sm text-zinc-700 font-semibold">{employee?.name}</p>
        <p className="text-xs text-zinc-500">{employee?.email}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SubHeading title="Absensi" />
        <SidebarLink href="/employee/dashboard/attendance/checkin" icon={ChevronUp}>Absensi Datang</SidebarLink>
        <SidebarLink href="/employee/dashboard/attendance/checkout" icon={ChevronDown}>Absensi Pulang</SidebarLink>
        <SidebarLink href="/employee/attendance/history" icon={Clock}>History Absensi</SidebarLink>

        <SubHeading title="Calendar" />
        <SidebarLink href="/employee/calendar" icon={CalendarDays}>Calendar</SidebarLink>

        <SubHeading title="Account" />
        <SidebarLink href="/employee/profile" icon={User}>Profile</SidebarLink>
        <SidebarLink href="/logout" icon={LogOut}>Logout</SidebarLink>
      </nav>
    </aside>
  )
}
