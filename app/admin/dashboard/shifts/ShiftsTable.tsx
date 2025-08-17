"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ShiftsTableProps {
  data: {
    id: number;
    type: string;
    timeRange: string;
    usersCount: number;
    schedulesCount: number;
  }[];
}

export function ShiftsTable({ data }: ShiftsTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No shifts found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Time Range</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Schedules</TableHead>
          <TableHead>Shift Relations</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((shift) => (
          <TableRow key={shift.id}>
            <TableCell>{shift.id}</TableCell>
            <TableCell>
              <span className="text-base font-semibold">{shift.type}</span>
            </TableCell>
            <TableCell>
              <span className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-1 rounded-lg">
                {shift.timeRange}
              </span>
            </TableCell>
            <TableCell><span className="bg-gray-800 text-xs font-semibold text-white px-2 py-0.5 rounded-md">Total : {shift.usersCount}</span></TableCell>
            <TableCell><span className="bg-gray-800 text-xs font-semibold text-white px-2 py-0.5 rounded-md">Total : {shift.schedulesCount}</span></TableCell>
            <TableCell className="space-x-2">
              <Link href={`/admin/dashboard/shifts/${shift.id}/users`}>
                <Button size="sm" variant="custom" className="px-3 py-1 text-sm font-medium text-sky-600 border border-gray-200 bg-[#ffffff46] hover:bg-gray-50">
                  See Users
                  <ChevronRight size={16} />
                </Button>
              </Link>

              <Link href={`/admin/dashboard/shifts/${shift.id}/schedules`}>
                <Button size="sm" variant="custom" className="px-3 py-1 text-sm font-medium text-sky-600 border border-gray-200 bg-[#ffffff46] hover:bg-gray-50">
                  See Schedules
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </TableCell>
            <TableCell className="space-x-2">
              <Button size="sm" variant="outline" onClick={() => toast.info(`Edit shift ${shift.id}`)}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => toast.success(`Delete shift ${shift.id}`)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
