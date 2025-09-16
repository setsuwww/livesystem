"use client";

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
                  <Button size="sm" variant="outline"
                    onClick={() => handleEdit(shift.id)}
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive"
                    onClick={() => handleDelete(shift.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {duplicateShifts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {duplicateShifts.map((shift) => (
            <Card key={shift.id} className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <h3 className="text-zinc-600">{capitalize(shift.type)}</h3>
                    <p className="text-xs text-zinc-400">{shift.shiftName}</p>
                    <Badge className={`mt-2 ${shiftStyles[shift.type]}`}>
                      {shift.timeRange}
                    </Badge>
                  </div>
                </CardTitle>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-0.5 bg-zinc-50 hover:bg-sky-50 text-zinc-600 hover:text-sky-600">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(shift.id)} className="hover:text-gray-600">
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(shift.id)} className="hover:bg-red-50 text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <p className="text-base font-semibold text-zinc-600 mb-4">
                    Assigned users:
                  </p>
                  <ul className="space-y-2">
                    {shift.users?.slice(0, 3).map((user) => (
                      <li key={user.id} className="flex items-center gap-x-2 justify-between border-b border-zinc-200 pb-2">
                        <span className="font-semibold text-zinc-600 text-sm">{user.name}</span>
                        <span className="text-xs text-sky-500">{user.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Schedules count */}
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="p-2 bg-zinc-200 text-zinc-600 rounded-lg">
                      <CalendarDays size={16} strokeWidth={2} />
                    </div>
                    <div className="text-sm flex items-center">
                      <span>Schedules : {shift.schedulesCount}</span>
                    </div>
                  </div>
                  <p>
                    {shift.users?.length > 3 && <ShiftAssignedUsersModal shift={shift} />}
                  </p>
                </div>
              </CardContent>

            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
