import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { DashboardStats } from "@/app/admin/dashboard/DashboardStats";
import { Clock, Sun, SunMoon, Moon } from "lucide-react";
import { DashboardDiagram } from "./DashboardDiagram";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // total
  const totalUsers = await prisma.user.count();
  const totalShifts = await prisma.shift.count();
  const totalSchedules = await prisma.schedule.count();

  // employees per shift
  const morningEmployees = await prisma.user.count({
    where: { shift: { type: "MORNING" } },
  });

  const afternoonEmployees = await prisma.user.count({
    where: { shift: { type: "AFTERNOON" } },
  });

  const eveningEmployees = await prisma.user.count({
    where: { shift: { type: "EVENING" } },
  });

  // chart dummy data
  const salesChartData = [
    { name: "1", value: 10, negativeValue: 2 },
    { name: "2", value: 15, negativeValue: 5 },
    { name: "3", value: 8, negativeValue: 3 },
    { name: "4", value: 20, negativeValue: 7 },
    { name: "5", value: 12, negativeValue: 4 },
    { name: "6", value: 18, negativeValue: 6 },
    { name: "7", value: 25, negativeValue: 9 },
  ];

  const ticketChartData = [
    { name: "Minggu", accepted: 5, rejected: 2, late: 1, onTime: 3 },
    { name: "Senin", accepted: 8, rejected: 1, late: 2, onTime: 4 },
    { name: "Selasa", accepted: 6, rejected: 3, late: 2, onTime: 5 },
    { name: "Rabu", accepted: 10, rejected: 2, late: 1, onTime: 6 },
    { name: "Kamis", accepted: 7, rejected: 1, late: 3, onTime: 4 },
    { name: "Jumat", accepted: 9, rejected: 4, late: 2, onTime: 5 },
    { name: "Sabtu", accepted: 11, rejected: 3, late: 1, onTime: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader title="Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStats
          dark={true}
          link="/admin/dashboard/shifts"
          title="Total Users"
          value={`${totalUsers.toString()} Users`}
          valueColor="text-yellow-400"
          icon={<Clock strokeWidth={2} />}
          color="bg-neutral-500 text-white"
        />

        <DashboardStats
          title="Morning Shifts"
          value={morningEmployees.toString()}
          icon={<Sun strokeWidth={2} />}
          color="bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600"
        />

        <DashboardStats
          title="Afternoon Shifts"
          value={afternoonEmployees.toString()}
          icon={<SunMoon strokeWidth={2} />}
          color="bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600"
        />

        <DashboardStats
          title="Evening Shifts"
          value={eveningEmployees.toString()}
          icon={<Moon strokeWidth={2} />}
          color="bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600"
        />
      </div>

      {/* Diagrams */}
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
        />
      </div>
    </div>
  );
}
