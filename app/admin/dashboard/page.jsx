// app/admin/dashboard/page.tsx
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { DashboardStats } from "@/app/admin/dashboard/DashboardStats";
import { Users, CalendarClock, Ticket, Clock } from "lucide-react";
import { DashboardDiagram } from "./DashboardDiagram";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const totalUsers = await prisma.user.count();
  const totalShifts = await prisma.shift.count();
  const totalSchedules = await prisma.schedule.count();

  const totalTicketsPositive = await prisma.ticket.count({ where: { status: "ACCEPTED" } });
  const totalTicketsNegative = await prisma.ticket.count({ where: { status: "REJECTED" } });

  const salesChartData = [
    { name: "1", value: 10, negativeValue: 2 },
    { name: "2", value: 15, negativeValue: 5 },
    { name: "3", value: 8, negativeValue: 3 },
    { name: "4", value: 20, negativeValue: 7 },
    { name: "5", value: 12, negativeValue: 4 },
    { name: "6", value: 18, negativeValue: 6 },
    { name: "7", value: 25, negativeValue: 9 },
    { name: "8", value: 22, negativeValue: 8 },
    { name: "9", value: 30, negativeValue: 10 },
    { name: "10", value: 28, negativeValue: 12 },
    { name: "11", value: 35, negativeValue: 15 },
    { name: "12", value: 40, negativeValue: 18 },
  ]

  const today = new Date();
  const dayStart = new Date(today);
  dayStart.setDate(today.getDate() - today.getDay());
  dayStart.setHours(0, 0, 0, 0);

  const ticketChartData = [
    { name: "Minggu", accepted: 5, rejected: 2, late: 1, onTime: 3 },
    { name: "Senin", accepted: 8, rejected: 1, late: 2, onTime: 4 },
    { name: "Selasa", accepted: 6, rejected: 3, late: 2, onTime: 5 },
    { name: "Rabu", accepted: 10, rejected: 2, late: 1, onTime: 6 },
    { name: "Kamis", accepted: 7, rejected: 1, late: 3, onTime: 4 },
    { name: "Jumat", accepted: 9, rejected: 4, late: 2, onTime: 5 },
    { name: "Sabtu", accepted: 11, rejected: 3, late: 1, onTime: 7 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader title="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStats
          link="/admin/dashboard/users"
          title="Total Users"
          value={totalUsers.toString()}
          negativeValue="0"
          icon={<Users strokeWidth={2} />}
          color="bg-sky-100 text-sky-600"
        />
        <DashboardStats
          link="/admin/dashboard/shifts"
          title="Total Shifts"
          value={totalShifts.toString()}
          negativeValue="0"
          icon={<Clock strokeWidth={2} />}
          color="bg-purple-100 text-purple-600"
        />
        <DashboardStats
          link="/admin/dashboard/schedules"
          title="Total Schedules"
          value={totalSchedules.toString()}
          negativeValue="0"
          icon={<CalendarClock strokeWidth={2} />}
          color="bg-green-100 text-green-600"
        />
        <DashboardStats
          link="/admin/dashboard/tickets"
          title="Total Tickets"
          value={totalTicketsPositive.toString()}
          negativeValue={totalTicketsNegative.toString()}
          icon={<Ticket strokeWidth={2} />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      <div className="grid gap-4 grid-cols-2">
        <DashboardDiagram
          title="Employee performance"
          description="Bad and Good performance from Employee"
          data={salesChartData}
          color="#1d293d"
          type="bar"
        />

        <DashboardDiagram
          title="Shifts statistic"
          data={ticketChartData}
          type="area"
          series={[
            { key: "accepted", color: "#7bf1a8", label: "On Time" },
            { key: "rejected", color: "#ffdf20", label: "Late" },
            { key: "late", color: "#ffa2a2", label: "Absent" },
            { key: "onTime", color: "#3b82f6", label: "Permission" },
          ]}
          select={true}
          options={[
            { text: "Google", url: "https://google.com" },
            { text: "Bing", url: "https://bing.com" },
            { text: "Yahoo", url: "https://yahoo.com" },
          ]}
        />
      </div>

    </div>
  );
}
