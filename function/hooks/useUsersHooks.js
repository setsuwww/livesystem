"use client";

import { useState, useMemo, useCallback } from "react";
import { handleUsers } from "@/function/handleUsers";

export function useUsersHooks(data) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  const extractShiftType = useCallback((shift) => {
    if (!shift) return "no_shift";

    const type = shift.type?.toLowerCase();
    if (!type || type === "normal shift") return "no_shift";

    return type;
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(user => { const matchSearch =
        search === "" || Object.values(user)
          .map(v => (typeof v === "string" ? v : ""))
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchRole = roleFilter === "all" ||
        user.role.toLowerCase() === roleFilter.toLowerCase();

      let matchShift = true;
      if (shiftFilter !== "all") {
        if (shiftFilter.toLowerCase() === "no_shift") {
          matchShift = !user.shift;
        } else {
          matchShift = extractShiftType(user.shift) === shiftFilter.toLowerCase();
        }
      }
      return matchSearch && matchRole && matchShift;
    });
  }, [data, search, roleFilter, shiftFilter, extractShiftType]);

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const {
    toggleSelect,
    selectAll,
    deleteSelected,
    deleteAll,
    handleEditUser,
    handleDeleteUser,
    onExportPDF,
  } = handleUsers(selectedIds, setSelectedIds, filteredData, () =>
    location.reload()
  );

  const handleSearchChange = useCallback((value) => setSearch(value), []);
  const handleRoleFilterChange = useCallback((value) => setRoleFilter(value), []);
  const handleShiftFilterChange = useCallback((value) => setShiftFilter(value), []);

  const isAllSelected = useMemo(
    () => selectedIds.length === filteredData.length && filteredData.length > 0,
    [selectedIds.length, filteredData.length]
  );

  return {
    search,
    roleFilter,
    shiftFilter,
    selectedIds,
    filteredData,
    selectedIdsSet,
    isAllSelected,

    // actions
    handleSearchChange,
    handleRoleFilterChange,
    handleShiftFilterChange,
    toggleSelect,
    selectAll,
    deleteSelected,
    deleteAll,
    handleEditUser,
    handleDeleteUser,
    onExportPDF,
  };
}
