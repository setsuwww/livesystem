"use client";

import React from "react";
import { UsersTableProps } from "@/static/interfaces/UsersTableProps";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import { UsersActionHeader } from "./UsersActionHeader";
import { UsersRow } from "./UsersRow";
import { roleStyles } from "@/constants/roleStyles";
import { useUsersHooks } from "@/function/hooks/useUsersHooks";

export default function UsersTable({ data }: UsersTableProps) {
  const {
    search, handleSearchChange,
    roleFilter, handleRoleFilterChange, shiftFilter, handleShiftFilterChange, filteredData,
    selectedIds, selectedIdsSet, isAllSelected,
    toggleSelect, selectAll,
    deleteSelected, deleteAll,
    handleEditUser, handleDeleteUser,
    onExportPDF,
  } = useUsersHooks(data);

  return (
    <div className="rounded-md space-y-4">
      <UsersActionHeader selectedCount={selectedIds.length}
        onDeleteSelected={deleteSelected}
        onDeleteAll={deleteAll}
        search={search}
        onSearchChange={handleSearchChange}
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
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Created & Updated</TableHead>
            <TableHead>Actions</TableHead>
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
              <UsersRow
                key={user.id}
                user={user}
                isSelected={selectedIdsSet.has(user.id)}
                onToggleSelect={toggleSelect}
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
