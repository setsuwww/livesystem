"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "@/_lib/api";

export function useEmployeesHooks(users, shifts) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [divisionFilter, setDivisionFilter] = useState("all");

  useEffect(() => {
    setData((users || []).filter((u) => u.role === "EMPLOYEE"));
  }, [users]);

  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchDivision = divisionFilter === "all" || u.division?.id === Number(divisionFilter);

      return matchSearch && matchDivision;
    });
  }, [data, search, divisionFilter]);

  const toggleSelect = useCallback((id) =>
    setSelected((prev) => prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
      ),
    []
  );

  const deleteSelected = useCallback(() => {
    if (!selected.length) return alert("No employees selected.");
    if (!confirm("Are you sure to delete selected employees?")) return;

    setData((prev) => prev.filter((u) => !selected.includes(u.id)));
    setSelected([]);
  }, [selected]);

  const deleteAll = useCallback(() => {
    if (!confirm("Are you sure to delete all employees?")) return;
    setData([]);
    setSelected([]);
  }, []);

  const exportCSV = useCallback(() => {
    const csv = [["ID", "Name", "Email", "Role"], ...filteredData.map((u) => [u.id, u.name, u.email, u.role])]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
  }, [filteredData]);

  const onSwitch = useCallback(
    async (id, newActiveState) => {
      try { await api.patch(`/users/${id}`, { active: newActiveState });
        setData((prev) =>
          prev.map((u) =>  u.id === id ? { ...u, active: newActiveState } : u)
        );
      } 
      catch (err) {alert("Failed to update user state")}
    }, []
  );

  const onDelete = useCallback(async (id) => { if (!confirm("Are you sure to delete this user?")) return;
    try { await api.delete(`/users/${id}`);
      setData((prev) => prev.filter((u) => u.id !== id));
    } 
    catch (err) {alert("Failed to delete user");}
  }, []);

  return {
    search, setSearch,
    selected, setSelected,
    data, filteredData,
    divisionFilter, setDivisionFilter,
    toggleSelect,
    deleteSelected, deleteAll,
    exportCSV,
    onSwitch, onDelete,
  };
}
