"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { format } from "date-fns"
import { OfficesStatusBadge } from "./OfficesStatusBadge"
import { Pencil, Trash2 } from "lucide-react"

export default function OfficesTable({ data, onEdit, onDelete }) {
  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Work Hours</TableHead>
            <TableHead>Created & Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            data.map((office) => (
              <TableRow key={office.id}>
                {/* Name + Location */}
                <TableCell className="flex flex-col">
                  <span className="text-sm text-neutral-600 font-semibold">{office.name}</span>
                  <span className="text-xs text-neutral-400">{office.location}</span>
                </TableCell>

                {/* Type */}
                <TableCell>
                  <Badge variant="outline">{office.type}</Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <OfficesStatusBadge status={office.status} />
                </TableCell>

                {/* Latitude */}
                <TableCell>
                  11.2232.123123
                </TableCell>

                {/* Longitude */}
                <TableCell>
                  123.123.123123123
                </TableCell>

                {/* Work Hours */}
                <TableCell>
                  {office.startTime && office.endTime
                    ? `${office.startTime} - ${office.endTime}`
                    : "-"}
                </TableCell>

                {/* Created & Updated */}
                <TableCell className="flex flex-col">
                  <span className="text-sm text-neutral-600 font-semibold">
                    {format(new Date(office.createdAt), "dd MMM yyyy")}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {format(new Date(office.updatedAt), "dd MMM yyyy")}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                    <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(office)} className="flex items-center gap-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete?.(office)} className="flex items-center gap-1">
                    Delete 
                  </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
