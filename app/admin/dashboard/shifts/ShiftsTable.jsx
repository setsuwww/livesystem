"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

import { capitalize } from "@/function/globalFunction";
import { Badge } from "@/components/ui/Badge";

import { fetch } from "@/function/helpers/fetch";
import { shiftStyles } from "@/constants/shiftStyles";

export function ShiftsTable({ data }) {
  const router = useRouter();

  const handleEdit = (id) => router.push(`/admin/dashboard/shifts/${id}/edit`);

  const handleDelete = async (id) => {
    try { await fetch({ url: `/shifts/${id}`, method: "delete",
        successMessage: "Shift deleted successfully",
        errorMessage: "Failed to delete shift",
      });
      router.refresh();
    } 
    catch (err) {
      console.error(err);
    }
  };

  const mainShifts = data.filter((s) => s.type === "MORNING" || s.type === "AFTERNOON" || s.type === "EVENING" );

  return (
    <div className="space-y-10">
      {mainShifts.length > 0 && (
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
                <TableCell className="font-bold text-zinc-600">{capitalize(shift.type)}</TableCell>
                <TableCell>
                  <Badge className={shiftStyles[shift.type]}>
                    {shift.timeRange}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>
                    Total : {shift.usersCount}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>
                    Total : {shift.schedulesCount}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/dashboard/shifts/${shift.id}/users`}>
                    <Button size="sm" variant="secondary">
                      See Users
                      <ChevronRight size={16} />
                    </Button>
                  </Link>
                  <Link href={`/admin/dashboard/shifts/${shift.id}/schedules`}>
                    <Button size="sm" variant="secondary">
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
      )}
    </div>
  );
}

