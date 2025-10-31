"use client";
import { useState, useMemo, useCallback } from "react";
import { handleUsers } from "../handlers/handleUsers";

export function useUsersHooks(initialData) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredData = useMemo(() => {
    console.log("ShiftFilter:", shiftFilter);
    console.log("Sample shifts:", initialData.map(u => u.shift));
    
    return initialData.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toUpperCase() || "USER";

      const shiftName = typeof user.shift === "string" ? user.shift : user.shift?.name || "None";

      const matchSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || role === roleFilter.toUpperCase();
      const matchShift = shiftFilter === "all" || shiftName.toLowerCase().includes(shiftFilter.toLowerCase());

      return matchSearch && matchRole && matchShift;
    });
  }, [initialData, search, roleFilter, shiftFilter]);

  const handleSearchChange = useCallback((v) => setSearch(v), []);
  const handleRoleFilterChange = useCallback((v) => setRoleFilter(v), []);
  const handleShiftFilterChange = useCallback((v) => setShiftFilter(v), []);

  const {
    toggleSelect, selectAll,
    isAllSelected, deleteSelected, deleteAll,
    handleEditUser, handleDeleteUser,
    onExportPDF,
  } = handleUsers({ filteredData, selectedIds, setSelectedIds })

  return {
    search, roleFilter, shiftFilter,
    selectedIds, selectedIdsSet, isAllSelected, filteredData,
    handleSearchChange, handleRoleFilterChange, handleShiftFilterChange,
    toggleSelect, selectAll, deleteSelected, deleteAll,
    handleEditUser, handleDeleteUser, onExportPDF
  };
}
