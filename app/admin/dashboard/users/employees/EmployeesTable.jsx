"use client";

import { useRouter } from "next/navigation";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmployeesActionHeader } from "./EmployeesActionHeader";
import { EmployeesRow } from "./EmployeesRow";

import { useEmployeesHooks } from "@/function/hooks/useEmployeesHooks";
// import ShiftScheduleTable from "./LintasartaTable";

export default function EmployeeTable({ users, shifts }) {
  const {
    search, setSearch,
    selected, setSelected,
    data, filteredData,
    toggleSelect,
    deleteSelected, deleteAll,
    exportCSV, onSwitch, onDelete,
  } = useEmployeesHooks(users, shifts);

  const router = useRouter();

  return (
    <div className="space-y-4">
      <EmployeesActionHeader
        search={search}
        setSearch={setSearch}
        selected={selected}
        onDeleteSelected={deleteSelected}
        onDeleteAll={deleteAll}
        onExport={exportCSV}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="flex items-center">
              <Checkbox
                checked={selected.length === data.length && data.length > 0}
                onCheckedChange={(value) =>
                  setSelected(value ? data.map((u) => u.id) : [])
                }
              />
            </TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Shifts</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created & Updated</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((user) => (
            <EmployeesRow
              key={user.id}
              user={user}
              selected={selected}
              toggleSelect={toggleSelect}
              onHistory={() => router.push("/admin/dashboard/users/" + user.id + "/history")}
              onSwitch={onSwitch}
              onEdit={() => router.push("/admin/dashboard/users/" + user.id + "/edit")}
              onDelete={() => onDelete(user.id)}
            />
          ))}
        </TableBody>
      </Table>


      {/* <ShiftScheduleTable /> */}
    </div>
  );
}
