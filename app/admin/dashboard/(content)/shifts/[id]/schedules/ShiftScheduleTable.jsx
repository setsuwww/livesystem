import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_components/ui/Table";
import { format } from "date-fns";

export default function ShiftUserTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Created & Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((schedule, index) => {
          const date = format(new Date(schedule.date), "dd-MM-yyyy");
          const created = format(new Date(schedule.createdAt), "dd-MM-yyyy");
          const updated = format(new Date(schedule.updatedAt), "dd-MM-yyyy");

          return (
            <TableRow key={schedule.id}>
              <TableCell>
                <span className="text-sm font-semibold">{schedule.title}</span>
              </TableCell>
              <TableCell>{schedule.description}</TableCell>              
              <TableCell>
                {date}
              </TableCell>
              <TableCell>
                <span className="space-x-2 text-sm">
                  <span className="text-xs border border-sky-300 bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md">{created}</span>
                  <span className="text-xs border border-yellow-300 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md">{updated}</span>
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
