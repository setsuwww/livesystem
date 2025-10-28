"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, Grip, Menu, X, Users, Clock, LayoutDashboard, User, CircleUserRound, Building2 } from "lucide-react"
import SubHeading from "./content/SubHeading"
import { roleStyles } from "@/_constants/roleStyles"
import clsx from "clsx"

const linkBase = "flex items-center gap-2 text-sm px-3 py-2 transition-colors"
const subLinkBase = "block text-sm px-3 py-1.5 transition-colors font-medium"

function SidebarLink({ href, icon: Icon, children, minimized }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={clsx( "rounded-lg flex items-center transition-all duration-200",
        minimized ? "justify-center h-12 w-12 mx-auto"
          : "gap-2 text-sm px-3 py-2 w-full",
        isActive ? "bg-slate-50 ring ring-slate-200 border-b-2 border-slate-200 text-slate-700"
          : "text-slate-600 hover:text-slate-700 hover:bg-slate-50"
      )}
    >
      <Icon className="text-yellow-500 shrink-0" size={18} />
      {!minimized && <span className="truncate">{children}</span>}
    </Link>
  )
}

function SidebarSubLink({ href, children, minimized }) {
  const pathname = usePathname()
  const isActive = pathname === href

  if (minimized) return null

  return (
    <Link href={href} className={clsx(subLinkBase, "rounded-lg",
        isActive ? "text-slate-700 font-semibold"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/70"
      )}
    >
      {children}
    </Link>
  )
}

function SidebarCollapsible({ title, items, icon: Icon, minimized }) {
  const router = useRouter()
  const pathname = usePathname()
  const isParentActive = items.some((item) => pathname === item.href)
  const [open, setOpen] = useState(isParentActive)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  const defaultHref = items[0]?.href

  useEffect(() => setOpen(isParentActive), [pathname])
  useEffect(() => {
    if (contentRef.current) setHeight(open ? contentRef.current.scrollHeight : 0)
  }, [open])

  const handleClick = () => {
    if (minimized && defaultHref) { router.push(defaultHref)} 
    else { setOpen(!open)}
  }

  return (
    <div className="flex flex-col px-4">
      <button onClick={handleClick} className={clsx("group w-full flex items-center transition-all duration-200 rounded-lg",
          minimized ? "justify-center h-12 w-12 mx-auto"
            : "justify-between px-3 py-2",
          isParentActive ? "bg-slate-50 ring ring-slate-200 border-b-2 border-slate-200 text-slate-700"
            : "text-slate-600 hover:text-slate-700 hover:bg-slate-50"
        )}
      >
        <div className="flex items-center gap-x-3">
          <Icon size={18} className="text-yellow-500" />
          {!minimized && <span className="text-sm">{title}</span>}
        </div>
        {!minimized && (
          <ChevronDown
            size={20}
            className={`text-slate-400 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {!minimized && (
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ height: `${height}px` }}
        >
          <div
            ref={contentRef}
            className="border-l-2 border-dashed border-slate-300 ml-5 flex flex-col space-y-1 p-2"
          >
            {items.map((item) => (
              <SidebarSubLink
                key={item.href}
                href={item.href}
                minimized={minimized}
              >
                {item.label}
              </SidebarSubLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export function Sidebar({ user }) {
  const [minimized, setMinimized] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const formattedRole =
    user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase()

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold text-sky-800">
          Live<span className="text-sky-600">system.</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-700 hover:text-slate-900"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        ></div>
      )}

      <aside className={clsx("fixed md:static top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 ease-in-out",
          minimized ? "w-[80px]" : "w-64",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className={clsx("flex items-center justify-between px-6 py-5 border-b border-slate-200",
            minimized ? "justify-center px-0" : ""
          )}
        >
          {!minimized && (
            <div className="text-2xl font-bold text-sky-800">
              Live<span className="text-sky-600">system.</span>
            </div>
          )}
          <button onClick={() => setMinimized(!minimized)} className="text-slate-400 hover:text-slate-500 transition-all bg-slate-50/50 border border-slate-100 rounded-md p-2"
          >
            {minimized 
              ? (<Grip size={20} className="rotate-90 transition-transform" />) 
              : (<ChevronDown size={20} className="-rotate-90 transition-transform"/>)
            }
          </button>
        </div>

        {/* Nav */}
        <nav className={clsx("flex-1 p-2 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400",
            minimized ? "px-1" : "px-2"
          )}
        >
          <SidebarLink
            href="/admin/dashboard"
            icon={LayoutDashboard}
            minimized={minimized}
          >
            Dashboard
          </SidebarLink>

          <SidebarCollapsible
            title="Users"
            icon={Users}
            items={[
              { label: "Users", href: "/admin/dashboard/users" },
              { label: "Add Users", href: "/admin/dashboard/users/create" },
            ]}
            minimized={minimized}
          />

          <SidebarCollapsible
            title="Division"
            icon={Building2}
            items={[
              { label: "Divisions", href: "/admin/dashboard/users/divisions" },
              { label: "Add Divisions", href: "/admin/dashboard/users/divisions/create",},
              { label: "Employees", href: "/admin/dashboard/users/employees" },
              { label: "Attendances", href: "/admin/dashboard/users/attendances",},
            ]}
            minimized={minimized}
          />

          <SidebarCollapsible
            title="Shift"
            icon={Clock}
            items={[
              { label: "Shifts", href: "/admin/dashboard/shifts" },
              { label: "Add Shifts", href: "/admin/dashboard/shifts/create" },
              { label: "Schedules", href: "/admin/dashboard/schedules" },
              { label: "Add Schedules", href: "/admin/dashboard/schedules/create",},
            ]}
            minimized={minimized}
          />

          <SidebarLink href="/admin/dashboard/profile" icon={User} minimized={minimized}>
            Profile
          </SidebarLink>
        </nav>

        {/* Footer */}
        <div className={clsx("p-4 border-t border-slate-200 bg-gradient-to-t from-slate-300 via-slate-100 to-white",
            minimized ? "flex justify-center px-0" : ""
          )}
        >
          <div className={clsx("flex items-center bg-white border border-slate-300 p-2 rounded-lg transition-all",
              minimized ? "justify-center h-12 w-12"
                : "space-x-2 w-full cursor-pointer"
            )}
          >
            <div className={`${roleStyles[formattedRole]} p-2 rounded-lg flex items-center justify-center`}>
              <CircleUserRound size={24} strokeWidth={1.5} />
            </div>
            {!minimized && (
              <div className="flex flex-col text-sm">
                <span className="font-semibold">{user?.name || "Guest"}</span>
                <span className="text-xs text-slate-500">
                  {user?.email || ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
