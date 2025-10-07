"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import { capitalize } from "@/function/globalFunction";
import { fetch } from "@/function/helpers/fetch";
import { shiftStyles, shiftIcons } from "@/constants/shiftConstants";

export function ShiftsView({ data }) {
  const router = useRouter();

  const handleEdit = (id) => router.push(`/admin/dashboard/shifts/${id}/edit`);

  const handleDelete = async (id) => {
    try {
      await fetch({
        url: `/shifts/${id}`,
        method: "delete",
        successMessage: "Shift deleted successfully",
        errorMessage: "Failed to delete shift",
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Time Range</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((shift) => (
            <TableRow key={shift.id}>
              {/* Name */}
              <TableCell className="font-semibold text-slate-700">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${shiftStyles[shift.type]}`}>
                    {shiftIcons[shift.type]}
                  </div>
                  <span>{shift.name}</span>
                </div>
              </TableCell>

              {/* Type */}
              <TableCell className="text-slate-600">
                <Badge className={shiftStyles[shift.type]}>
                  {capitalize(shift.type)}
                </Badge>
              </TableCell>

              {/* Time Range */}
              <TableCell>
                <Badge variant="outline" className="text-slate-600 border-slate-300">
                  {shift.timeRange}
                </Badge>
              </TableCell>

              {/* Users */}
              <TableCell>
                <Link
                  href={`/admin/dashboard/shifts/${shift.id}/users`}
                  className="text-sky-500 hover:underline flex items-center gap-x-1"
                >
                  <CircleUserRound strokeWidth={1.5} size={15} /> {shift.usersCount} Users
                </Link>
              </TableCell>
              {/* Actions */}
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
  );
}
