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

  const totalTicketsPositive = await prisma.ticket.count({where: { status: "ACCEPTED" }});
  const totalTicketsNegative = await prisma.ticket.count({where: { status: "REJECTED" }});

  const ticketData = await prisma.ticket.groupBy({
    by: ['createdAt', 'status'],
    _count: { id: true },
  });

  const salesChartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1; const accepted = ticketData.filter(d => d.createdAt.getMonth() + 1 === month && d.status === "ACCEPTED")
      .reduce((acc, curr) => acc + curr._count.id, 0);
    const rejected = ticketData.filter(d => d.createdAt.getMonth() + 1 === month && d.status === "REJECTED")
      .reduce((acc, curr) => acc + curr._count.id, 0);
    return { name: month.toString(), value: accepted, negativeValue: rejected };
  });

  const today = new Date();
  const dayStart = new Date(today);
  dayStart.setDate(today.getDate() - today.getDay());
  dayStart.setHours(0, 0, 0, 0);

  const ticketWeekData = await prisma.ticket.findMany({where: { createdAt: { gte: dayStart } },select: { createdAt: true, status: true }});

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const ticketChartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(dayStart);
    date.setDate(dayStart.getDate() + i);

    const accepted = ticketWeekData.filter(t => t.createdAt.getDate() === date.getDate() && t.status === "ACCEPTED").length;
    const rejected = ticketWeekData.filter(t => t.createdAt.getDate() === date.getDate() && t.status === "REJECTED").length;

    return { name: dayNames[i], value: accepted, negativeValue: rejected };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader title="Dashboard" />

      {/* Statistik */}
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
          title="Total Shifts"
          value={totalShifts.toString()}
          negativeValue="0"
          icon={<Clock strokeWidth={2} />}
          color="bg-purple-100 text-purple-600"
        />
        <DashboardStats
          title="Total Schedules"
          value={totalSchedules.toString()}
          negativeValue="0"
          icon={<CalendarClock strokeWidth={2} />}
          color="bg-green-100 text-green-600"
        />
        <DashboardStats
          title="Total Tickets"
          value={totalTicketsPositive.toString()}
          negativeValue={totalTicketsNegative.toString()}
          icon={<Ticket strokeWidth={2} />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Diagram */}
      <div className="grid gap-4 grid-cols-2">
        <DashboardDiagram
          title="Ticket in/month"
          description="Tickets growth in/month"
          data={salesChartData}
          color="#1d293d"
          type="bar"
        />
        <DashboardDiagram
          title="Ticket in/week"
          description="Tickets growth in/week"
          data={ticketChartData}
          color="#00a6f4"
          type="area"
        />
      </div>
    </div>
  );
}
