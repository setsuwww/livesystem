"use client";

import useSWR from "swr";
import { ShiftsTable } from "@/app/admin/dashboard/shifts/ShiftsTable";
import { ShiftCards } from "./ShiftsCards";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ShiftsRealtime({
  initialData,
}: {
  initialData: any;
}) {
  const { data, error, isLoading } = useSWR("/api/shifts", fetcher, {
    refreshInterval: 5000, // auto-refresh setiap 5 detik
    fallbackData: initialData, // pakai data SSR dulu
    revalidateOnFocus: true,   // refetch saat user kembali ke tab
  });

  if (isLoading) return <p>Loading shifts...</p>;
  if (error) return <p>Error loading shifts.</p>;

  const mainShifts = data.filter((s: any) =>
    ["MORNING", "AFTERNOON", "NIGHT"].includes(s.type)
  );

  const customShifts = data.filter((s: any) => s.type === "CUSTOM");

  const tableData = mainShifts.map((s: any) => {
    const start = s.startTime
      ? new Date(s.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      : "??:??";
    const end = s.endTime
      ? new Date(s.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      : "??:??";

    return {
      id: s.id,
      type: s.type,
      customType: s.customType,
      timeRange: `${start} - ${end}`,
      usersCount: s.users.length,
      schedulesCount: s.schedules.length,
      users: s.users,
    };
  });

  const mappedCustom = customShifts.map((s: any) => {
    const start = s.startTime
      ? new Date(s.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      : "??:??";
    const end = s.endTime
      ? new Date(s.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      : "??:??";

    return {
      id: s.id,
      type: s.type,
      customType: s.customType ?? undefined,
      timeRange: `${start} - ${end}`,
      usersCount: s.users.length,
      schedulesCount: s.schedules.length,
      users: s.users,
    };
  });

  return (
    <>
      <ShiftsTable data={tableData} />

      {mappedCustom.length > 0 && (
        <div className="mt-8">
          <ShiftCards shifts={mappedCustom} />
        </div>
      )}
    </>
  );
}
