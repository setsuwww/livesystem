"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, MoreVertical, CalendarDays } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ContentList } from "@/components/content/ContentList";
import { ShiftAssignedUsersModal } from './ShiftAssignedUsersModal';

import { capitalize } from "@/function/globalFunction";
import { fetch } from "@/function/helpers/fetch";
import { shiftStyles, defaultShifts, shiftIcons } from "@/constants/shiftConstants";
import { ShiftsDuplicateCard } from './ShiftsDuplicateCard';

export function ShiftsView({ data }) {
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

  const grouped = data.reduce((acc, shift) => { if (!acc[shift.type]) acc[shift.type] = [];
    acc[shift.type].push(shift);
    return acc;
  }, {});

  const mainShifts = defaultShifts
    .map((type) => grouped[type]?.[0])
    .filter(Boolean);

  const duplicateShifts = defaultShifts
    .flatMap((type) => grouped[type]?.slice(1) || [])
    .filter(Boolean);

  return (

    <div className="space-y-8">
      <ContentList items={["Shifts will be randomized every 3 weeks"]} />

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
                <TableCell className="font-bold text-zinc-600">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-xl ${shiftStyles[shift.type]}`}>
                      {shiftIcons[shift.type]}
                    </div>
                    <span>{capitalize(shift.type)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={shiftStyles[shift.type]}>
                    {shift.timeRange}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>Total : {shift.usersCount}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>Total : {shift.schedulesCount}</Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/dashboard/shifts/${shift.id}/users`}>
                    <Button size="sm" variant="secondary">
                      See Users <ChevronRight size={16} />
                    </Button>
                  </Link>
                  <Link href={`/admin/dashboard/shifts/${shift.id}/schedules`}>
                    <Button size="sm" variant="secondary">
                      See Schedules <ChevronRight size={16} />
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

      {duplicateShifts.length > 0 && (
        <ShiftsDuplicateCard shifts={duplicateShifts} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}