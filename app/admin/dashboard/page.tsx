import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader"
import { DashboardStats } from "@/app/admin/dashboard/DashboardStats"
import { Users, Calendar, Ticket } from "lucide-react"
import { DashboardDiagram } from "./DashboardDiagram"

export default function AdminDashboardPage() {
  const salesData = [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 200 },
    { name: "Mar", value: 110 },
    { name: "Apr", value: 320 },
    { name: "May", value: 200 },
    { name: "Jun", value: 100 },
    { name: "Jul", value: 210 },
    { name: "Aug", value: 220 },
    { name: "Sep", value: 230 },
    { name: "Oct", value: 300 },
    { name: "Nov", value: 290 },
    { name: "Des", value: 280 },
  ]

  const ticketData = [
    { name: "Support", value: 12 },
    { name: "Sales", value: 25 },
    { name: "Tech", value: 20 },
    { name: "Tech", value: 12 },
    { name: "Tech", value: 2 },
    { name: "Tech", value: 12 },
    { name: "Tech", value: 50 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader title="Dashboard"/>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStats title="Total Users"
          value="120"
          icon={<Users strokeWidth={2.5}/>}
          color="bg-sky-100 text-sky-600"
        />
        <DashboardStats
          title="Total Schedules"
          value="35"
          icon={<Calendar strokeWidth={2.5} />}
          color="bg-green-100 text-green-600"
        />
        <DashboardStats
          title="Total Calendars"
          value="20"
          icon={<Calendar strokeWidth={2.5} />}
          color="bg-purple-100 text-purple-600"
        />
        <DashboardStats
          title="Total Tickets"
          value="12"
          icon={<Ticket strokeWidth={2.5} />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      <div className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
        Shift
      </div>

      {/* Diagram */}
      <div className="grid gap-4 grid-cols-2">
        <DashboardDiagram
          title="Pemasukan Ticket"
          description="Data Ticket masuk"
          data={salesData}
          color="#1d293d"
          type="bar"
        />
        <DashboardDiagram
          title="Tickets Trend (Area)"
          description="Perkembangan tiket"
          data={ticketData}
          color="#00a6f4"
          type="area"
        />
      </div>
    </div>
  )
}
