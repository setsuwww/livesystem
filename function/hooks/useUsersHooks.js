"use client";

import { useState, useMemo, useCallback, useDeferredValue, useRef } from "react";
import { handleUsers } from "@/function/handleUsers";

export function useUsersHooks(data) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  const deferredSearch = useDeferredValue(search);
  const searchInputRef = useRef(null);

  const extractShiftType = useCallback((shift) => {
    if (!shift || shift === "-") return "NO_SHIFT";
    const match = shift.match(/^(\w+)/);
    const type = match ? match[1].toUpperCase() : "NO_SHIFT";
    return type === "OFF" ? "NO_SHIFT" : type;
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchSearch =
        deferredSearch === "" ||
        Object.values(user)
          .map((v) => (typeof v === "string" ? v : ""))
          .join(" ")
          .toUpperCase()
          .includes(deferredSearch.toUpperCase());

      const matchRole =
        roleFilter === "all" ||
        user.role?.toUpperCase() === roleFilter.toUpperCase();

      let matchShift = true;
      if (shiftFilter !== "all") {
        if (shiftFilter.toUpperCase() === "NO_SHIFT") {
          matchShift = !user.shift || user.shift === "-";
        } else {
          matchShift = extractShiftType(user.shift) === shiftFilter.toUpperCase();
        }
      }

      return matchSearch && matchRole && matchShift;
    });
  }, [data, deferredSearch, roleFilter, shiftFilter, extractShiftType]);

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

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleRoleFilterChange = useCallback((value) => {
    setRoleFilter(value);
  }, []);

  const handleShiftFilterChange = useCallback((value) => {
    setShiftFilter(value);
  }, []);

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
    searchInputRef,
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