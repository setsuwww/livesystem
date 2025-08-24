"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Clock, 
  Calendar, 
  User, 
  FileText, 
  Home,
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react";

export default function EmployeeDashboardLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [notifications] = useState(3); // Mock notification count

  const userData = {
    name: "John Doe",
    role: "Software Developer",
    employeeId: "EMP001",
    avatar: "/api/placeholder/40/40"
  };

  const menuItems = [
    {
      href: "/employee/dashboard",
      icon: Home,
      label: "Dashboard",
      description: "Overview & Quick Actions"
    },
    {
      href: "/employee/attendance",
      icon: Clock,
      label: "Attendance",
      description: "Clock in/out & History"
    },
    {
      href: "/employee/schedule",
      icon: Calendar,
      label: "My Schedule",
      description: "Work shifts & Calendar"
    },
    {
      href: "/employee/requests",
      icon: FileText,
      label: "Requests",
      description: "Leave & Permission"
    },
    {
      href: "/employee/profile",
      icon: User,
      label: "Profile",
      description: "Personal Information"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white border-r border-gray-200 shadow-lg 
        flex flex-col transition-all duration-300 ease-in-out
        ${sidebarOpen ? "w-72" : "w-0 lg:w-16"}
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo & User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${sidebarOpen ? "opacity-100" : "lg:opacity-0"}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                {userData.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-900 text-sm truncate">{userData.name}</p>
                <p className="text-xs text-gray-500 truncate">{userData.employeeId}</p>
              </div>
            </div>
            
            {/* Close button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? "opacity-100 w-auto" : "lg:opacity-0 lg:w-0"}`}>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 group-hover:text-blue-600">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-100">
          <button className="group flex items-center gap-3 w-full px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`font-medium text-sm transition-all duration-300 ${sidebarOpen ? "opacity-100" : "lg:opacity-0"}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Employee Portal
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Welcome back, {userData.name}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              {/* User Info */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-900">{userData.name}</span>
                <span className="text-xs text-gray-500">{userData.role}</span>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {userData.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}