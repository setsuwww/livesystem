import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader"
import { DashboardStats } from "@/app/admin/dashboard/DashboardStats"
import { Users, CalendarClock, CalendarDays, Ticket } from "lucide-react"
import { DashboardDiagram } from "./DashboardDiagram"

export default function AdminDashboardPage() {
  const salesData = [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 200 },
    { name: "Mar", value: 110 },
    { name: "Apr", value: 120 },
    { name: "May", value: 200 },
    { name: "Jun", value: 100 },
    { name: "Jul", value: 110 },
    { name: "Aug", value: 220 },
    { name: "Sep", value: 130 },
    { name: "Oct", value: 100 },
    { name: "Nov", value: 290 },
    { name: "Des", value: 80 },
  ]

  const ticketData = [
    { name: "Senin", value: 12 },
    { name: "Selasa", value: 25 },
    { name: "Rabu", value: 12 },
    { name: "Kamis", value: 22 },
    { name: "Jumat", value: 10 },
    { name: "Sabtu", value: 32 },
    { name: "Minggu", value: 10 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader title="Dashboard"/>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStats title="Total Users"
          value="120"
          icon={<Users strokeWidth={2}/>}
          color="bg-sky-100 text-sky-600"
        />
        <DashboardStats
          title="Total Schedules"
          value="35"
          icon={<CalendarClock strokeWidth={2}/>}
          color="bg-green-100 text-green-600"
        />
        <DashboardStats
          title="Total Calendars"
          value="20"
          icon={<CalendarDays strokeWidth={2} />}
          color="bg-purple-100 text-purple-600"
        />
        <DashboardStats
          title="Total Tickets"
          value="12"
          icon={<Ticket strokeWidth={2} />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Diagram */}
      <div className="grid gap-4 grid-cols-2">
        <DashboardDiagram
          title="Ticket in/month"
          description="Tickets growth in/month"
          data={salesData}
          color="#1d293d"
          type="bar"
        />
        <DashboardDiagram
          title="Ticket in/week"
          description="Tickets growth in/week"
          data={ticketData}
          color="#00a6f4"
          type="area"
        />
      </div>
    </div>
  )
}
