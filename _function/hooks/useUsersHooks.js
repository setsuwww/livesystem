"use client";

import { useState, useMemo, useCallback, useDeferredValue, useRef } from "react";
import { handleUsers } from "@/_function/handlers/handleUsers";

export function useUsersHooks(data) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  const deferredSearch = useDeferredValue(search);
  const searchInputRef = useRef(null);

  // Extract shift type untuk normalisasi
  const extractShiftType = useCallback((shift) => { if (!shift || shift === "-") return "NO_SHIFT";
    const match = shift.match(/^(\w+)/);
    const type = match ? match[1].toUpperCase() : "NO_SHIFT";
    return type === "OFF" ? "NO_SHIFT" : type;
  }, []);

  // Filtering data
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchSearch = deferredSearch === "" ||
        [user.name, user.email, user.role, user.shift]
          .filter(Boolean) .join(" ")
          .toUpperCase() .includes(deferredSearch.toUpperCase());

      const matchRole = roleFilter === "all" ||
        user.role?.toUpperCase() === roleFilter.toUpperCase();

      let matchShift = true;
      if (shiftFilter !== "all") {
        if (shiftFilter.toUpperCase() === "NO_SHIFT") { matchShift = !user.shift || user.shift === "-";} 
        else { matchShift = extractShiftType(user.shift) === shiftFilter.toUpperCase() }
      }

      return matchSearch && matchRole && matchShift;
    });
  }, [data, deferredSearch, roleFilter, shiftFilter, extractShiftType]);

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  // Actions
  const { toggleSelect, selectAll, deleteSelected, deleteAll, handleEditUser, handleDeleteUser, onExportPDF } = 
    handleUsers(selectedIds, setSelectedIds, filteredData, () => location.reload());

  // Handlers
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleRoleFilterChange = useCallback((value) => {
    setRoleFilter(value);
  }, []);

  const handleShiftFilterChange = useCallback((value) => {
    setShiftFilter(value);
  }, []);

  const isAllSelected = useMemo(() => selectedIds.length > 0 && selectedIds.length === filteredData.length,
    [selectedIds, filteredData]
  );

  return {
    search, roleFilter, shiftFilter,
    selectedIds, filteredData, selectedIdsSet, isAllSelected,
    searchInputRef, handleSearchChange, handleRoleFilterChange, handleShiftFilterChange,
    toggleSelect, selectAll, deleteSelected, deleteAll,
    handleEditUser, handleDeleteUser,
    onExportPDF,
  };
}

export function useSearchUsers(users, query, fields = ["name", "email"]) {
  const filteredUsers = useMemo(() => {
    if (!query) return users;

    const lowerQuery = query.toLowerCase();

    return users.filter((user) =>
      fields.some((field) =>
        String(user[field] ?? "").toLowerCase().includes(lowerQuery)
      )
    );
  }, [users, query, fields]);

  return filteredUsers;
}

