// app/admin/dashboard/page.tsx
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { DashboardStats } from "@/app/admin/dashboard/DashboardStats";
import { Users, CalendarClock, Ticket, Clock } from "lucide-react";
import { DashboardDiagram } from "./DashboardDiagram";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // ========== Stats ==============
  const totalUsers = await prisma.user.count();
  const totalShifts = await prisma.shift.count();
  const totalSchedules = await prisma.schedule.count();
  const totalTicketsPositive = await prisma.ticket.count({ where: { status: "ACCEPTED" } });
  const totalTicketsNegative = await prisma.ticket.count({ where: { status: "REJECTED" } });

  // ========== Dummy employee performance (sementara) ==========
  const salesChartData = [
    { name: "Jan", value: 10, negativeValue: 2 },
    { name: "Feb", value: 15, negativeValue: 5 },
    { name: "Mar", value: 8, negativeValue: 3 },
    { name: "Apr", value: 20, negativeValue: 7 },
    { name: "Mei", value: 12, negativeValue: 4 },
    { name: "Jun", value: 18, negativeValue: 6 },
    { name: "Jul", value: 25, negativeValue: 9 },
    { name: "Agu", value: 22, negativeValue: 8 },
    { name: "Sep", value: 30, negativeValue: 10 },
    { name: "Okt", value: 28, negativeValue: 12 },
    { name: "Nov", value: 35, negativeValue: 15 },
    { name: "Des", value: 40, negativeValue: 18 },
  ];

  // ========== Ticket statistic (dinamis) ==========
  // Hitung berdasarkan hari dalam seminggu
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const tickets = await prisma.ticket.findMany({
    select: {
      status: true,
      createdAt: true,
    },
  });

  const ticketByDay = days.map((day, idx) => {
    const filtered = tickets.filter((t) => new Date(t.createdAt).getDay() === idx);
    return {
      name: day,
      accepted: filtered.filter((t) => t.status === "ACCEPTED").length,
      rejected: filtered.filter((t) => t.status === "REJECTED").length,
      late: filtered.filter((t) => t.status === "LATE").length,
      onTime: filtered.filter((t) => t.status === "ONTIME").length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader title="Dashboard" />

      {/* Stats pakai data asli dari DB */}
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

      {/* Diagram */}
      <div className="grid gap-4 grid-cols-2">
        {/* Dummy performance (sementara) */}
        <DashboardDiagram
          title="Employee performance"
          description="Bad and Good performance from Employee"
          data={salesChartData}
          type="bar"
          series={[
            { key: "value", color: "#1d293d", label: "Good" },
            { key: "negativeValue", color: "#ff4d4f", label: "Bad" },
          ]}
        />

        {/* Dinamis: ticket per hari */}
        <DashboardDiagram
          title="Shifts statistic"
          description="Statistic by ticket status each day"
          data={ticketByDay}
          type="area"
          series={[
            { key: "accepted", color: "#7bf1a8", label: "Accepted" },
            { key: "rejected", color: "#ff4d4f", label: "Rejected" },
            { key: "late", color: "#ffdf20", label: "Late" },
            { key: "onTime", color: "#3b82f6", label: "On Time" },
          ]}
        />
      </div>
    </div>
  );
}
