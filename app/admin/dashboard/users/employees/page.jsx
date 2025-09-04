import { prisma } from "@/lib/prisma";

import { ContentInformation } from "@/components/content/ContentInformation";
import ContentForm from "@/components/content/ContentForm";
import EmployeesTable from "./EmployeesTable";
import { DashboardHeader } from "../../DashboardHeader";
import { Pagination } from "../../Pagination";

const PAGE_SIZE = 5;

async function getEmployees(page = 1) {
  return await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      shift: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getEmployeeCount() {
  return await prisma.user.count({
    where: { role: "EMPLOYEE" },
  });
}

export const revalidate = 60;

export default async function EmployeesPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  const [users, total] = await Promise.all([
    getEmployees(page),
    getEmployeeCount(),
  ]);

  const serializedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(), updatedAt: u.updatedAt.toISOString(),
    shift: u.shift
      ? {
        ...u.shift,
        startTime: u.shift.startTime.toISOString(), endTime: u.shift.endTime.toISOString(),
      }
      : null,
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (page > totalPages && totalPages > 0) { return <div className="p-4">Page not found</div> }

  return (
    <section>
      <DashboardHeader title="Employees" subtitle="Employees management" />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation heading="List Employees" subheading="Manage all employees here" />
        </ContentForm.Header>

        <ContentForm.Body>
          <EmployeesTable users={serializedUsers} />
        </ContentForm.Body>

        <Pagination page={page} totalPages={totalPages} basePath="/admin/dashboard/employees" />
      </ContentForm>
    </section>
  );
}
