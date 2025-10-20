import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { Pagination } from "@/app/admin/dashboard/Pagination";
import UsersTable from "./UsersTable";

import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";

import { capitalize } from "@/function/globalFunction";
import { minutesToTime } from "@/function/services/shiftAttendance";

const PAGE_SIZE = 5;
export const revalidate = 60;

async function getUsers(page = 1) {
  return prisma.user.findMany({
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      shift: {
        select: { name: true, type: true, startTime: true, endTime: true },
      },
      office: {
        select: { name: true,
          startTime: true, endTime: true,
          shifts: {
            select: { name: true, startTime: true, endTime: true },
            where: { isActive: true },
          },
        },
      },
    },
  });
}

async function getUserCount() {
  return prisma.user.count();
}

export default async function Page({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  const [users, total] = await Promise.all([
    getUsers(page),
    getUserCount(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages && totalPages > 0) return notFound();

  const tableData = users.map((u) => {
    // 🧩 PRIORITAS WAKTU
    // 1️⃣ Langsung dari shift user
    const userShift = u.shift
      ? {
          label: capitalize(u.shift.name || u.shift.type),
          start: u.shift.startTime,
          end: u.shift.endTime,
        }
      : null;

    // 2️⃣ Kalau gak ada shift, coba ambil shift kantor (first active)
    const officeShift =
      !userShift && u.office?.shifts?.length
        ? {
            label: `${u.office.shifts[0].name} (Office)`,
            start: u.office.shifts[0].startTime,
            end: u.office.shifts[0].endTime,
          }
        : null;

    // 3️⃣ Kalau gak ada juga, ambil jam kerja default dari kantor
    const officeTime =
      !userShift && !officeShift && u.office?.startTime && u.office?.endTime
        ? {
            label: u.office.name,
            start: u.office.startTime,
            end: u.office.endTime,
          }
        : null;

    // 🔄 Tentukan final fallback (urutan prioritas)
    const finalShift = userShift || officeShift || officeTime;

    const shiftLabel = finalShift ? finalShift.label : "—";
    const shiftTime = finalShift
      ? `${minutesToTime(finalShift.start)} - ${minutesToTime(finalShift.end)}`
      : "—";

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: capitalize(u.role),
      shift: shiftLabel,
      shiftTime,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    };
  });

  return (
    <section>
      <DashboardHeader title="Users" subtitle="Users data detail" />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation
            heading="List users"
            subheading="Manage all users data in this table"
            show
            buttonText="Create Users"
            href="/admin/dashboard/users/create"
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <UsersTable data={tableData} />
          <Pagination
            page={page}
            totalPages={totalPages}
            basePath="/admin/dashboard/users"
          />
        </ContentForm.Body>
      </ContentForm>
    </section>
  );
}
