"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import EmployeesActionHeader from "./EmployeesActionHeader";
import EmployeesRow from "./EmployeesRow";
import { useEmployeesHooks } from "@/function/hooks/useEmployeesHooks";

export default function EmployeeTable({ users }) {
  const { search, setSearch,
    selected, setSelected,
    data, filteredData,
    toggleSelect, deleteSelected, deleteAll,
    exportCSV, onSwitch, onEdit, onDelete,
  } = useEmployeesHooks(users);

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
              onSwitch={onSwitch}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
