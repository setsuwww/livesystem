"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_components/ui/Table";
import { Badge } from "@/_components/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/Select";
import { shiftStyles } from "@/_constants/shiftConstants";
import { attedancesStyles } from "@/_constants/attedanceConstants";
import { safeFormat, capitalize } from "@/_function/globalFunction";
import { ContentInformation } from "@/_components/content/ContentInformation";

export default function AttendancesTable({ data }) {
  const [sortOrder, setSortOrder] = useState("desc"); // default: terbaru duluan

  // urutkan data berdasarkan tanggal
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [data, sortOrder]);

  return (
    <>
      <div className="flex items-center justify-between my-6">
        <ContentInformation
          heading="List Attendances"
          subheading="Manage and review all attendance records"
        />

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-slate-600 mr-1">Sort By:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Check In & Out</TableHead>
            <TableHead>Total Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData.map((att) => (
            <TableRow key={att.id}>
              <TableCell>{safeFormat(att.date, "dd MMMM yyyy")}</TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-700 font-semibold">{att.user?.name}</span>
                  <span className="text-xs text-slate-400">{att.user?.email}</span>
                </div>
              </TableCell>

              <TableCell>
                {att.shift ? (
                  <Badge
                    className={`px-2 py-0.5 rounded-md border-none ${
                      shiftStyles[att.shift.type] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {capitalize(att.shift.name)}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-teal-500">{safeFormat(att.checkInTime, "HH:mm")}</span>
                  <span className="text-sm text-rose-500">{safeFormat(att.checkOutTime, "HH:mm")}</span>
                </div>
              </TableCell>

              <TableCell>{att.shift ? `${att.shift.startTime} - ${att.shift.endTime}` : "-"}</TableCell>

              <TableCell>
                <Badge className={`border-none ${attedancesStyles[capitalize(att.status)]}`}>
                  {capitalize(att.status)}
                </Badge>
              </TableCell>

              <TableCell>{att.reason ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
