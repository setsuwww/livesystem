"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import { UsersActionHeader } from "./UsersActionHeader";
import { UsersRow } from "./UsersRow";
import { roleStyles } from "@/constants/roleStyles";
import { useUsersHooks } from "@/function/hooks/useUsersHooks";
import { Users, Settings, ClockFading, Menu, Activity } from 'lucide-react';

export default function UsersTable({ data }) { const {
    search, handleSearchChange,
    roleFilter, handleRoleFilterChange, shiftFilter, handleShiftFilterChange, filteredData,
    selectedIds, selectedIdsSet, isAllSelected,
    toggleSelect, selectAll, deleteSelected, deleteAll,
    handleEditUser, handleDeleteUser,
    onExportPDF,
  } = useUsersHooks(data);

  return (
    <div className="rounded-md space-y-4">
      <UsersActionHeader selectedCount={selectedIds.length}
        onDeleteSelected={deleteSelected} onDeleteAll={deleteAll}
        search={search} onSearchChange={handleSearchChange}
        roleFilter={roleFilter} onRoleFilterChange={handleRoleFilterChange}
        shiftFilter={shiftFilter} onShiftFilterChange={handleShiftFilterChange}
        filteredData={filteredData}
        onExportPDF={() => onExportPDF(filteredData)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="flex items-center">
              <Checkbox checked={isAllSelected} onCheckedChange={selectAll} />
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-yellow-500" />Username
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-yellow-500" /> Email
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <ClockFading size={16} className="text-yellow-500" /> Shift
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Menu size={16} className="text-yellow-500" /> Created & Updated
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-yellow-500" /> Actions
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map(user => (
              <UsersRow key={user.id} user={user}
                isSelected={selectedIdsSet.has(user.id)} onToggleSelect={toggleSelect}
                onEdit={handleEditUser} onDelete={handleDeleteUser}
                roleStyles={roleStyles}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
