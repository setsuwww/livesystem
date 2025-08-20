"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { capitalize } from "@/function/functionFormatters";
import { ShiftType } from "@prisma/client";

interface ShiftsTableProps {
  data: {
    id: number;
    type: ShiftType;
    customType?: string | null;
    timeRange: string;
    usersCount: number;
    schedulesCount: number;
    users?: { id: number; name: string }[];
  }[];
  customData?: {
    id: number;
    customType: string | null;
    startTime: Date;
    endTime: Date;
    users: { id: number; name: string }[];
  }[];
}

export function ShiftsTable({ data }: ShiftsTableProps) {
  const router = useRouter();

  const handleEdit = (id: number) => router.push(`/admin/dashboard/shifts/${id}/edit`);

  const handleDelete = async (id: number) => {
    try { const res = await fetch(`/api/shifts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Shift deleted successfully");
      router.refresh();
    } 
    catch (err) {
      toast.error("Failed to delete shift");
    }
  };

  const mainShifts = data.filter((s) => s.type === "MORNING" || s.type === "AFTERNOON" || s.type === "NIGHT");

  return (
    <div className="space-y-10">
      {mainShifts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Main Shifts</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift</TableHead>
                <TableHead>Time Range</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Schedules</TableHead>
                <TableHead>Shift Relations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mainShifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">{capitalize(shift.type)}</TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-1 rounded-lg">
                      {shift.timeRange}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="bg-gray-800 text-xs font-semibold text-white px-2 py-0.5 rounded-md">
                      Total : {shift.usersCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="bg-gray-800 text-xs font-semibold text-white px-2 py-0.5 rounded-md">
                      Total : {shift.schedulesCount}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Link href={`/admin/dashboard/shifts/${shift.id}/users`}>
                      <Button size="sm" className="bg-gray-50 border border-gray-200 text-sky-600 px-3 py-1 text-sm font-medium hover:bg-sky-50">
                        See Users
                        <ChevronRight size={16} />
                      </Button>
                    </Link>
                    <Link href={`/admin/dashboard/shifts/${shift.id}/schedules`}>
                      <Button size="sm" className="bg-gray-50 border border-gray-200 text-sky-600 px-3 py-1 text-sm font-medium hover:bg-sky-50">
                        See Schedules
                        <ChevronRight size={16} />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(shift.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(shift.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

