// components/schedule/ScheduleTable.tsx
"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Schedule } from "@/static/interfaces/Schedule";

interface Props {
  data: Schedule[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function ScheduleTable({ data, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No schedules found
            </TableCell>
          </TableRow>
        ) : (
          data.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.id}</TableCell>
              <TableCell>{schedule.title}</TableCell>
              <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <div>
                  <div className="text-sm font-medium">
                    {new Date(schedule.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(schedule.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit && onEdit(schedule.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete && onDelete(schedule.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
