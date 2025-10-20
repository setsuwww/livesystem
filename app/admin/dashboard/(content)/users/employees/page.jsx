import { prisma } from "@/lib/prisma";
import { ContentInformation } from "@/components/content/ContentInformation";
import ContentForm from "@/components/content/ContentForm";
import EmployeesTable from "./EmployeesTable";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { Pagination } from "@/app/admin/dashboard/Pagination";
import { minutesToTime } from "@/function/services/shiftAttendanceHelpers";

const PAGE_SIZE = 100;

async function getEmployees(page = 1) {
  return prisma.user.findMany({
    where: {
      role: "EMPLOYEE",
      shiftId: { not: null },
    },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { shift: true, office: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getEmployeeCount() {
  return prisma.user.count({
    where: {
      role: "EMPLOYEE",
      shiftId: { not: null },
    },
  });
}

async function getFilterData() {
  const [offices, shifts] = await Promise.all([
    prisma.office.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
    prisma.shift.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return { offices, shifts };
}

export const revalidate = 30;

export default async function EmployeesPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  const [[users, total], { offices, shifts }] = await Promise.all([
    Promise.all([getEmployees(page), getEmployeeCount()]),
    getFilterData(),
  ]);

  const serializedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    shift: u.shift
      ? {
          ...u.shift,
          startTime: minutesToTime(u.shift.startTime),
          endTime: minutesToTime(u.shift.endTime),
        }
      : null,
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (page > totalPages && totalPages > 0)
    return <div className="p-4">Page not found</div>;

  return (
    <section>
      <DashboardHeader title="Employees" subtitle="Employees management" />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation
            heading="List Employees"
            subheading="Manage all employees here"
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <EmployeesTable
            users={serializedUsers}
            offices={offices}
            shifts={shifts}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            basePath="/admin/dashboard/employees"
          />
        </ContentForm.Body>
      </ContentForm>
    </section>
  );
}
