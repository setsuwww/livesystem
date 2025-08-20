// app/admin/dashboard/shifts/page.tsx
import { DashboardHeader } from "../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Pagination } from "../Pagination";

import { ShiftsTable } from "./ShiftsTable";
import { ShiftCustomCards } from "./ShiftsCustomCards";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

const PAGE_SIZE = 6;

async function getMainShifts() {
  return await prisma.shift.findMany({
    where: { type: { in: ["MORNING", "AFTERNOON", "NIGHT"] } },
    select: { id: true, type: true, customType: true,
      startTime: true, endTime: true,
      users: { select: { id: true, name: true } },
      schedules: { select: { id: true, title: true } },
    },
    orderBy: { type: "asc" },
  });
}

async function getCustomShifts(page: number = 1) {
  const [shifts, count] = await Promise.all([
    prisma.shift.findMany({
      where: { type: "CUSTOM" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, type: true, customType: true,
        startTime: true, endTime: true,
        users: { select: { id: true, name: true } },
        schedules: { select: { id: true, title: true } },
      },
      orderBy: { id: "desc" },
    }),
    prisma.shift.count({ where: { type: "CUSTOM" } }),
  ]);

  return { shifts, count };
}

export const revalidate = 60;

export default async function ShiftsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page) || 1;

  const [mainShifts, { shifts: customShifts, count: totalCustom }] = await Promise.all([
    getMainShifts(),
    getCustomShifts(page),
  ]);

  const tableData = mainShifts.map((s) => {
    const start = s.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
    const end = s.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

    return { id: s.id, type: s.type, customType: s.customType,
      timeRange: `${start} - ${end}`,
      usersCount: s.users.length,
      schedulesCount: s.schedules.length,
      users: s.users,
    };
  });

  const mappedCustom = customShifts.map((s) => {
    const start = s.startTime ? s.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) : "??:??";
    const end = s.endTime ? s.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) : "??:??";

    return { id: s.id, type: s.type, 
      customType: s.customType ?? undefined,
      timeRange: `${start} - ${end}`,
      usersCount: s.users.length, schedulesCount: s.schedules.length,
      users: s.users,
    };
  });

  const totalPages = Math.ceil(totalCustom / PAGE_SIZE);

  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>;
  }

  return (
    <section>
      <DashboardHeader title="Shifts" subtitle="Manage shifts data" />
      <ContentForm>
        <ContentInformation heading="List shifts" subheading="Manage all shift data in this table" />
        
        <ShiftsTable data={tableData} />

        {mappedCustom.length > 0 && (
          <div className="mt-8">
            <ContentInformation heading="Custom Shifts" subheading="These are your custom defined shifts" />
            <ShiftCustomCards shifts={mappedCustom} />

            <Link href="/otw-fitur" className="mt-10">
              <Button variant="secondary">
                Specific shift <ChevronRight size={10}/>
              </Button>
            </Link>

            {totalCustom > PAGE_SIZE && (
              <Pagination page={page} totalPages={totalPages} basePath="/admin/dashboard/shifts" />
            )}
          </div>
        )}
      </ContentForm>
    </section>
  );
}
