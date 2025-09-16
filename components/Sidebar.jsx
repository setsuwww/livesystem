'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef  } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, Users, Clock, LayoutDashboard, User, Settings } from 'lucide-react'
import SubHeading from './content/SubHeading'

const linkBase = "flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors"
const subLinkBase = "block text-sm px-3 py-1.5 font-base rounded-lg transition-colors"

function SidebarLink({
  href,
  icon: Icon,
  children
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`${linkBase} ${isActive ? 'bg-sky-100 text-sky-700' : 'text-zinc-600 hover:bg-sky-100 hover:text-sky-700'}`}>
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
    <Link href={href} className={`${subLinkBase} ${isActive ? 'text-sky-600' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'}`}>
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
      <button
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
          ${isParentActive ? 'bg-sky-100 text-sky-700' : 'text-zinc-600 hover:bg-sky-100 hover:text-sky-700'}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-x-2">
          <Icon size={18} />
          <span>{title}</span>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible content */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className="border-l-2 border-zinc-300 ml-4 flex flex-col space-y-1 mt-2 p-2">
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

export function Sidebar() {
  const [userOpen, setUserOpen] = useState(false)
  const [employeesOpen, setEmployeesOpen] = useState(false)
  const [shiftOpen, setShiftOpen] = useState(false)

  return (
    <aside className="w-64 h-screen bg-white font-semibold flex flex-col border-0 border-r-2 border-zinc-200">
      <picture className='px-8 py-2 border-b border-zinc-200'>
        <Image src="/images/lintasarta.webp" width={150} height={150} alt='Lintasarta' />
      </picture>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SubHeading title='Main' />
        <SidebarLink href="/admin/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>

        <SidebarCollapsible title="Users" open={userOpen} onOpenChange={setUserOpen} icon={Users}
          items={[
            { label: 'Users', href: '/admin/dashboard/users' },
            { label: 'Add Users', href: '/admin/dashboard/users/create' },
          ]}
        />

        <SidebarCollapsible title="Employees" open={employeesOpen} onOpenChange={setEmployeesOpen} icon={Users}
          items={[
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
            { label: 'Shifts Schedule', href: '/admin/dashboard/shifts_schedule' },
            { label: 'Relation', href: '/admin/dashboard/realtion' },
            { label: 'Conflict', href: '/admin/dashboard/conflict' },
          ]}
        />

        <SubHeading title='Account' />
        <SidebarLink href="/admin/dashboard/profile" icon={User}>Profile</SidebarLink>
        <SidebarLink href="/admin/dashboard/setting" icon={Settings}>Settings</SidebarLink>
      </nav>
    </aside>
  )
}
