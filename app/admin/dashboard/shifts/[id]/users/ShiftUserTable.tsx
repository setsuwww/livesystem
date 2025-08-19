import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { capitalize } from "@/function/functionCapitalize";
import { format } from "date-fns";

import { roleStyles } from "@/constants/roleStyles";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  shift: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface UsersTableProps {
  data: User[];
}

export default function ShiftUserTable({ data }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created & Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user, index) => {
          const created = format(new Date(user.createdAt), "dd-MM-yyyy");
          const updated = format(new Date(user.updatedAt), "dd-MM-yyyy");

          return (
            <TableRow key={user.id}>
              <TableCell>
                <span className="text-sm font-semibold">{user.name}</span>
              </TableCell>
              <TableCell>{user.email}</TableCell>              
              <TableCell>
                <span className={`px-3 py-1 text-sm font-semibold border rounded-full ${roleStyles[capitalize(user.role)] ?? ""}`}>
                  {capitalize(user.role)}
                </span>
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
