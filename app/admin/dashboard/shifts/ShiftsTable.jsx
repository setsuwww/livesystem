"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

import { capitalize } from "@/function/globalFunction";
import { Badge } from "@/components/ui/Badge";

=======
import { ChevronRight, MoreVertical } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import { ContentList } from "@/components/content/ContentList";
import { capitalize } from "@/function/globalFunction";
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
import { fetch } from "@/function/helpers/fetch";
import { shiftStyles } from "@/constants/shiftStyles";

export function ShiftsTable({ data }) {
  const router = useRouter();

<<<<<<< HEAD
  const handleEdit = (id) => router.push(`/admin/dashboard/shifts/${id}/edit`);
=======
  const handleEdit = (id) =>
    router.push(`/admin/dashboard/shifts/${id}/edit`);
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf

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

<<<<<<< HEAD
  const mainShifts = data.filter((s) => s.type === "MORNING" || s.type === "AFTERNOON" || s.type === "EVENING" );

  return (
    <div className="space-y-10">
=======
  // group by type
  const grouped = data.reduce((acc, shift) => { if (!acc[shift.type]) acc[shift.type] = [];
    acc[shift.type].push(shift);
    return acc;
  }, {});

  // ambil 3 shift utama
  const mainTypes = ["MORNING", "AFTERNOON", "EVENING"];
  const mainShifts = mainTypes
    .map((type) => grouped[type]?.[0])
    .filter(Boolean);

  // shift duplicate → jadi card
  const duplicateShifts = mainTypes
    .flatMap((type) => grouped[type]?.slice(1) || [])
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <ContentList items={["Shifts will be randomized every 3 weeks"]} />

>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
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
<<<<<<< HEAD
                <TableCell className="font-bold text-zinc-600">{capitalize(shift.type)}</TableCell>
=======
                <TableCell className="font-bold text-zinc-600">
                  {capitalize(shift.type)}
                </TableCell>
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
                <TableCell>
                  <Badge className={shiftStyles[shift.type]}>
                    {shift.timeRange}
                  </Badge>
                </TableCell>
                <TableCell>
<<<<<<< HEAD
                  <Badge>
                    Total : {shift.usersCount}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>
                    Total : {shift.schedulesCount}
                  </Badge>
=======
                  <Badge>Total : {shift.usersCount}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>Total : {shift.schedulesCount}</Badge>
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
                </TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/dashboard/shifts/${shift.id}/users`}>
                    <Button size="sm" variant="secondary">
<<<<<<< HEAD
                      See Users
                      <ChevronRight size={16} />
=======
                      See Users <ChevronRight size={16} />
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
                    </Button>
                  </Link>
                  <Link href={`/admin/dashboard/shifts/${shift.id}/schedules`}>
                    <Button size="sm" variant="secondary">
<<<<<<< HEAD
                      See Schedules
                      <ChevronRight size={16} />
=======
                      See Schedules <ChevronRight size={16} />
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className="space-x-2">
<<<<<<< HEAD
                  <Button size="sm" variant="outline" onClick={() => handleEdit(shift.id)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(shift.id)}>
=======
                  <Button size="sm" variant="outline"
                    onClick={() => handleEdit(shift.id)}
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive"
                    onClick={() => handleDelete(shift.id)}
                  >
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
<<<<<<< HEAD
    </div>
  );
}

=======

      {/* Duplicate shifts → Card */}
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

                {/* Ellipsis menu */}
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
                  <ul className="space-y-1">
                    {shift.users?.slice(0, 3).map((user) => (
                      <li key={user.id} className="flex items-center justify-between border-b border-zinc-200 pb-2 text-sm">
                        <span className="font-semibold text-zinc-500">
                          {user.name}
                        </span>
                        <span className="text-zinc-400">
                          {user.email}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {shift.users?.length > 3 && (
                    <Link  href={`/admin/dashboard/shifts/${shift.id}/users`} className="text-xs text-blue-600 hover:underline">
                      View details ({shift.users.length - 3} more)
                    </Link>
                  )}
                </div>

                {/* Schedules */}
                <p className="text-sm text-zinc-600">
                  Schedules:{" "}
                  <span className="font-semibold">
                    {shift.schedulesCount}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
>>>>>>> c510f67eeba6b8b8fa93313c365581c9c47f3ccf
