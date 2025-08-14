"use client"

// Global
import React, { useState, useMemo, useCallback } from "react";
import { UsersTableProps } from "@/static/interfaces/UsersTableProps";

// UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsersActionHeader } from "./UsersActionHeader";
import { UsersRow } from "./UsersRow";

// Hooks & Function
import { handleUsersHandlers } from "./function/handleUsersHandlers";

export default function UsersTable({ data }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const roleStyles = useMemo(() => ({
    ADMIN: "px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full",
    MANAGER: "px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full",
    USER: "px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full",
  }), []);

  const extractShiftType = useCallback((shiftString: string) => {
    if (shiftString === "-" || shiftString === "Normal Shift") return "NO_SHIFT";
    const match = shiftString.match(/^([A-Z]+)/);
    return match ? match[1] : "NO_SHIFT";
  }, []);

  const filteredData = useMemo(() => data.filter(user => {
    const matchSearch = search === "" || Object.values(user).join(" ").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;

    let matchShift = true;
    if (shiftFilter !== "all") {
      if (shiftFilter === "NO_SHIFT") { 
        matchShift = user.shift === "-" || user.shift === "Normal Shift";
      } else {
        matchShift = extractShiftType(user.shift) === shiftFilter;
      }
    }
    return matchSearch && matchRole && matchShift;
  }), [data, search, roleFilter, shiftFilter, extractShiftType]);

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const { toggleSelect, selectAll, deleteSelected, deleteAll, handleEditUser, handleDeleteUser } = handleUsersHandlers(selectedIds, setSelectedIds, filteredData, () => location.reload());

  const handleSearchChange = useCallback((value: string) => setSearch(value), []);
  const handleRoleFilterChange = useCallback((value: string) => setRoleFilter(value), []);
  const handleShiftFilterChange = useCallback((value: string) => setShiftFilter(value), []);

  const isAllSelected = useMemo(() =>
    selectedIds.length === filteredData.length && filteredData.length > 0,
    [selectedIds.length, filteredData.length]
  );

  return (
    <div className="rounded-md space-y-4">
      <UsersActionHeader
        search={search} onSearchChange={handleSearchChange}
        roleFilter={roleFilter} onRoleFilterChange={handleRoleFilterChange}
        shiftFilter={shiftFilter} onShiftFilterChange={handleShiftFilterChange}
        selectedCount={selectedIds.length} 
        onDeleteSelected={deleteSelected} 
        onDeleteAll={deleteAll}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input type="checkbox" checked={isAllSelected} onChange={selectAll} />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
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
              <UsersRow key={user.id} user={user} isSelected={selectedIdsSet.has(user.id)} onToggleSelect={toggleSelect}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser} roleStyles={roleStyles}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
