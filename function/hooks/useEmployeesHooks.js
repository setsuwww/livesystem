"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

export function useEmployeesHooks(users) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);

  // ambil hanya employee
  useEffect(() => {
    setData((users || []).filter((u) => u.role === "EMPLOYEE"));
  }, [users]);

  // filtering pake useMemo (hanya re-compute kalau search/data berubah)
  const filteredData = useMemo(() => {
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // --- ACTIONS ---
  const toggleSelect = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const deleteSelected = useCallback(() => {
    alert("Delete selected: " + selected.join(", "));
    setData((prev) => prev.filter((u) => !selected.includes(u.id)));
    setSelected([]);
  }, [selected]);

  const deleteAll = useCallback(() => {
    alert("Delete all employees!");
    setData([]);
    setSelected([]);
  }, []);

  const exportCSV = useCallback(() => {
    const csv = [
      ["ID", "Name", "Email", "Role"],
      ...filteredData.map((u) => [u.id, u.name, u.email, u.role]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
  }, [filteredData]);

  const onSwitch = useCallback((id) => console.log("switch", id), []);
  const onEdit = useCallback((id) => console.log("edit", id), []);
  const onDelete = useCallback((id) => console.log("delete", id), []);

  return {
    search, setSearch, 
    selected, setSelected,
    data, filteredData,
    toggleSelect, deleteSelected,
    deleteAll, exportCSV,
    onSwitch, onEdit, onDelete,
  };
}
