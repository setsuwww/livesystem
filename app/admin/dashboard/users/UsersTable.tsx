"use client"

import React, { useState, useMemo, useCallback } from "react";
import { UsersTableProps } from "@/static/interfaces/UsersTableProps";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import { UsersActionHeader } from "./UsersActionHeader";
import { UsersRow } from "./UsersRow";

import { handleUsers } from "@/function/handleUsers";
import { roleStyles } from "@/constants/roleStyles";

export default function UsersTable({ data }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const extractShiftType = useCallback((shiftString: string) => {
    if (!shiftString || shiftString === "-" || shiftString.toLowerCase() === "normal shift") { return "no_shift"}

    const match = shiftString.match(/^([A-Za-z]+)/);
    return match ? match[1].toLowerCase() : "no_shift";
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(user => {
      const matchSearch = search === "" || Object.values(user).join(" ").toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();

      let matchShift = true;
      if (shiftFilter !== "all") {
        if (shiftFilter.toLowerCase() === "no_shift") { matchShift = user.shift === "-" || user.shift.toLowerCase() === "normal shift" } 
          else { matchShift = extractShiftType(user.shift) === shiftFilter.toLowerCase() }
      } return matchSearch && matchRole && matchShift;
    });
  }, [data, search, roleFilter, shiftFilter, extractShiftType]);

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const { 
    toggleSelect, selectAll, deleteSelected, deleteAll, 
    handleEditUser, handleDeleteUser, onExportPDF 
  } = handleUsers(
    selectedIds, setSelectedIds, filteredData, () => location.reload());

  const handleSearchChange = useCallback((value: string) => setSearch(value), []);
  const handleRoleFilterChange = useCallback((value: string) => setRoleFilter(value), []);
  const handleShiftFilterChange = useCallback((value: string) => setShiftFilter(value), []);

  const isAllSelected = useMemo(() => selectedIds.length === filteredData.length && filteredData.length > 0, [selectedIds.length, filteredData.length]);

  return (
    <div className="rounded-md space-y-4">
      <UsersActionHeader selectedCount={selectedIds.length} onDeleteSelected={deleteSelected} onDeleteAll={deleteAll} 
        search={search} onSearchChange={handleSearchChange}
        roleFilter={roleFilter} onRoleFilterChange={handleRoleFilterChange}
        shiftFilter={shiftFilter} onShiftFilterChange={handleShiftFilterChange}
        filteredData={filteredData} onExportPDF={() => onExportPDF(filteredData)}
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
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No data found</TableCell></TableRow>
          ) : (
            filteredData.map(user => (
              <UsersRow key={user.id} user={user} isSelected={selectedIdsSet.has(user.id)} onToggleSelect={toggleSelect}
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