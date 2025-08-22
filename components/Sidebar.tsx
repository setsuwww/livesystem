'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, Users, CalendarDays, Clock, LayoutDashboard, User, Settings, CalendarClock, Ticket } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/Collapsible'
import SubHeading from './content/SubHeading'

const linkBase = "flex items-center gap-2 text-md px-3 py-2 rounded-lg transition-colors"
const subLinkBase = "block text-sm px-3 py-1.5 font-base rounded-lg transition-colors"
const triggerBase = "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors focus:outline-none"
const subContentBase = "border-l-2 border-zinc-300 ml-4 flex flex-col space-y-1 mt-2 p-2"

function SidebarLink({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`${linkBase} ${isActive ? 'bg-sky-100 text-sky-700' : 'text-zinc-600 hover:bg-sky-100 hover:text-sky-700'}`}>
      <Icon size={18} />
      {children}
    </Link>
  )
}

function SidebarSubLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`${subLinkBase} ${isActive ? 'text-sky-600' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'}`}>
      {children}
    </Link>
  )
}

function SidebarCollapsible({ title, open, onOpenChange, items, icon: Icon}: 
  { title: string, open: boolean, onOpenChange: (event: boolean) => void, items: { label: string; href: string }[], icon: React.ElementType }) {

  const pathname = usePathname()
  const isParentActive = items.some(item => pathname === item.href)

  return (
    <Collapsible open={open || isParentActive} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className={`${triggerBase} ${isParentActive ? 'bg-sky-100 text-sky-700' : 'text-zinc-600 hover:bg-sky-100 hover:text-sky-700'}`}>
        <div className="flex items-center gap-x-2">
          <Icon size={18} />
          <span>{title}</span>
        </div>
        <ChevronDown size={20} className={`transition-transform duration-200 ${open || isParentActive ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>

      <CollapsibleContent className={subContentBase}>
        {items.map((item) => (
          <SidebarSubLink key={item.href} href={item.href}>
            {item.label}
          </SidebarSubLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function Sidebar() {
  const [userOpen, setUserOpen] = useState(false)
  const [shiftOpen, setShiftOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  return (
    <aside className="w-64 h-screen bg-white font-semibold flex flex-col border-0 border-r-2 border-zinc-200">
      <picture className='px-8 py-2 border-b border-zinc-200'>
        <Image src="/images/lintasarta.webp" width={150} height={150} alt='Lintasarta' />
      </picture>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SubHeading title='Main'/>
        <SidebarLink href="/admin/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>
        
        <SubHeading title='Management'/>
        <SidebarCollapsible title="Users" open={userOpen} onOpenChange={setUserOpen} icon={Users}
          items={[
            { label: 'Coordinator', href: '/admin/dashboard/coordinator' },
            { label: 'Employee', href: '/admin/dashboard/employee' },
            { label: 'Users', href: '/admin/dashboard/users' },
            { label: 'Add Users', href: '/admin/dashboard/users/create' }
          ]}
        />
        
        <SidebarCollapsible title="Shift" open={shiftOpen} onOpenChange={setShiftOpen} icon={Clock}
          items={[
            { label: 'Shifts', href: '/admin/dashboard/shifts' },
            { label: 'Add Shifts', href: '/admin/dashboard/shifts/create' }
          ]}
        />

        <SidebarCollapsible title="Calendars" open={calendarOpen} onOpenChange={setCalendarOpen} icon={CalendarDays}
          items={[
            { label: 'Calendars', href: '/admin/dashboard/calendars' },
            { label: 'Schedules', href: '/admin/dashboard/schedules' },
            { label: 'Add Schedules', href: '/admin/dashboard/schedules/create' },
          ]}
        />

        <SubHeading title='Account'/>
        <SidebarLink href="/admin/dashboard/profile" icon={User}>Profile</SidebarLink>
        <SidebarLink href="/admin/dashboard/setting" icon={Settings}>Settings</SidebarLink>
      </nav>
    </aside>
  )
}
