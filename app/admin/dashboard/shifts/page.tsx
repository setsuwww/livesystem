// app/admin/dashboard/shifts/page.tsx
import { DashboardHeader } from "../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Pagination } from "../Pagination";

import { ShiftsTable } from "./ShiftsTable";
import { prisma } from "@/lib/prisma";
import { capitalize } from "../../../../function/functionCapitalize";

const PAGE_SIZE = 5;

async function getShifts(page: number = 1) {
  return await prisma.shift.findMany({
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: { id: true, type: true, customType: true,
      startTime: true,
      endTime: true,
      users: {
        select: {
          id: true,
          name: true,
        },
      },
      schedules: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

async function getShiftCount() {
  return await prisma.shift.count();
}

export const revalidate = 60;

export default async function ShiftsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page) || 1;

  const [shifts, total] = await Promise.all([
    getShifts(page),
    getShiftCount(),
  ]);

  const tableData = shifts.map((s) => {
    const start = s.startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    const end = s.endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

    return {
      id: s.id,
      type: capitalize(s.type),
      customType: s.customType,
      timeRange: `${start} - ${end}`,
      usersCount: s.users.length,
      schedulesCount: s.schedules.length,
    };
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>;
  }

  return (
    <section>
      <DashboardHeader title="Shifts" subtitle="Manage shifts data" />
      <ContentForm>
        <ContentInformation heading="List shifts" subheading="Manage all shift data in this table"/>
        <ShiftsTable data={tableData} />

        <Pagination page={page} totalPages={totalPages} basePath="/admin/dashboard/shifts"/>
      </ContentForm>
    </section>
  );
}
