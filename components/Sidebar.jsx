'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef  } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, Users, Clock, LayoutDashboard, User, Settings } from 'lucide-react'
import SubHeading from './content/SubHeading'
import { CircleUserRound } from 'lucide-react';
import { capitalize } from '@/function/globalFunction';
import { roleStyles } from '@/constants/roleStyles';

const linkBase = "flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors"
const subLinkBase = "block text-sm px-3 py-1.5 font-base rounded-r-lg transition-colors"

function SidebarLink({
  href,
  icon: Icon,
  children
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`${linkBase} ${isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-sky-100 hover:text-sky-700'}`}>
      <Icon size={18} />
      {children}
    </Link>
  )
}

function SidebarSubLink({
  href,
  children
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`${subLinkBase} ${isActive ? 'border-l-2 border-0 bg-sky-100 border-sky-400 text-sky-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
      {children}
    </Link>
  )
}

function SidebarCollapsible({ title, items, icon: Icon }) {
  const pathname = usePathname()
  const isParentActive = items.some(item => pathname === item.href)
  const [open, setOpen] = useState(isParentActive)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setOpen(isParentActive)
  }, [pathname])

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open])

  return (
    <div className="flex flex-col">
      <button className={`group   w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
          ${isParentActive ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-sky-100 hover:text-sky-700'}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-x-2">
          <Icon size={18} className="group-hover:scale-125 group-hover:mr-1 transition-all" />
          <span className="group-hover:font-bold">{title}</span>
        </div>
        <ChevronDown size={20}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible content */}
      <div className="overflow-hidden transition-all duration-300" style={{ height: `${height}px` }}>
        <div ref={contentRef} className="border-l-2 border-slate-300 ml-4 flex flex-col space-y-1 mt-2 p-2">
          {items.map(item => (
            <SidebarSubLink key={item.href} href={item.href}>
              {item.label}
            </SidebarSubLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ user }) {
  const [userOpen, setUserOpen] = useState(false)
  const [employeesOpen, setEmployeesOpen] = useState(false)
  const [shiftOpen, setShiftOpen] = useState(false)

  const formattedRole = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase()

  return (
    <aside className="w-64 h-screen bg-white font-semibold flex flex-col border-r-2 border-0 border-slate-200">
      <div className='text-2xl font-bold px-7 text-sky-800 py-6 border-b border-slate-200'>
        Live<span className="text-sky-600">system.</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SubHeading title='Main' />
        <SidebarLink href="/admin/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>

        <SidebarCollapsible title="Users" open={userOpen} onOpenChange={setUserOpen} icon={Users}
          items={[
            { label: 'Users', href: '/admin/dashboard/users' },
            { label: 'Add Users', href: '/admin/dashboard/users/create' },
          ]}
        />

        <SidebarCollapsible title="Offices" open={employeesOpen} onOpenChange={setEmployeesOpen} icon={Users}
          items={[
            { label: 'Offices', href: '/admin/dashboard/users/locations' },
            { label: 'Add Offices', href: '/admin/dashboard/users/locations/create'},
            { label: 'Employees', href: '/admin/dashboard/users/employees' },
            { label: 'Attendances', href: '/admin/dashboard/users/attendances' },
          ]}
        />

        <SidebarCollapsible
          title="Shift"
          open={shiftOpen}
          onOpenChange={setShiftOpen}
          icon={Clock}
          items={[
            { label: 'Shifts', href: '/admin/dashboard/shifts' },
            { label: 'Add Shifts', href: '/admin/dashboard/shifts/create' },
            { label: 'Schedules', href: '/admin/dashboard/schedules' },
            { label: 'Add Schedules', href: '/admin/dashboard/schedules/create' },
          ]}
        />

        <SubHeading title='Account' />
        <SidebarLink href="/admin/dashboard/profile" icon={User}>Profile</SidebarLink>
        <SidebarLink href="/admin/dashboard/setting" icon={Settings}>Settings</SidebarLink>
      </nav>

      <div className="p-4 border-t border-slate-200 bg-gradient-to-t from-slate-300 via-slate-100 towhite">
        <div className="flex items-center space-x-2 bg-white border border-slate-300 p-2 rounded-lg cursor-pointer">
        <div className={`${roleStyles[formattedRole]} p-2 rounded-lg`}>
          <CircleUserRound size={28} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col text-sm">
          <div className="flex items-center justify-between space-x-2">
            <span className="font-semibold">{user?.name || "Guest"}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleStyles[formattedRole]}`}>{capitalize(user?.role || "")}</span>
          </div>
          <span className="text-xs text-slate-500">{user?.email || ""}</span>
        </div>
        </div>
      </div>
    </aside>
  )
}
