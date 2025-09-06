"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from '@/lib/api';

export function useEmployeesHooks(users) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => { setData((users || []).filter((u) => u.role === "EMPLOYEE")) }, [users]);

  const filteredData = useMemo(() => {
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const toggleSelect = useCallback((id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]), []);

  const deleteSelected = useCallback(() => { alert("Delete selected: " + selected.join(", "));
    setData((prev) => prev.filter((u) => !selected.includes(u.id)));
    setSelected([]);
  }, [selected]);

  const deleteAll = useCallback(() => { alert("Delete all employees!");
    setData([]);
    setSelected([]);
  }, []);

  const exportCSV = useCallback(() => {
    const csv = [["ID", "Name", "Email", "Role"],
      ...filteredData.map((u) => [u.id, u.name, u.email, u.role]),
    ]
      .map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
  }, [filteredData]);

  const onSwitch = useCallback((id) => setEditUser(data.find((usr) => usr.id === id)), [data]);

  const onEdit = useCallback((id) => setEditUser(data.find((usr) => usr.id === id)), [data]);
  
  const onDelete = useCallback(async (id) => { if (!confirm("Are you sure to delete this user?")) return;
    try { await api.delete(`/users/${id}`);
      setData((prev) => prev.filter((u) => u.id !== id));
    }  
    catch (err) {
      alert("Failed to delete user");
    }
  }, []);


  return {
    search, setSearch, 
    selected, setSelected,
    data, filteredData,
    toggleSelect, deleteSelected,
    deleteAll, exportCSV,
    onSwitch, onEdit, onDelete,
  };
}
