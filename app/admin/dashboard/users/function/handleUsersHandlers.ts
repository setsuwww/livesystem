import { useCallback } from "react";
import { api } from "@/lib/api";

export const handleUsersHandlers = (
  selectedIds: number[], 
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>,
  filteredData: any[], 
  reloadData: () => void
) => {
  
  // Toggle Select combobox
  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  }, [setSelectedIds]);

  // Toggle Selectall combobox
  const selectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.length === filteredData.length ? [] : filteredData.map(u => u.id)
    );
  }, [filteredData, setSelectedIds]);

  // Menghapus semua yang di select
  const deleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;

    try {
      await api.delete("/users", { data: { ids: selectedIds } });
      alert("Deleted successfully");
      reloadData();
    } catch {
      alert("Failed to delete selected");
    }
  }, [selectedIds, reloadData]);

  // Menghapus semua
  const deleteAll = useCallback(async () => {
    if (filteredData.length === 0) return;

    try {
      await api.delete("/users", { data: { ids: filteredData.map(u => u.id) } });
      alert("All deleted");
      reloadData();
    } catch {
      alert("Failed to delete all");
    }
  }, [filteredData, reloadData]);

  // Edit users
  const handleEditUser = useCallback(async (id: number) => {
    const name = prompt("Enter new name:");
    if (!name) return;
    try {
      await api.patch(`/users/${id}`, { name });
      alert("Updated successfully");
      reloadData();
    } catch {
      alert("Failed to update");
    }
  }, [reloadData]);

  // Delete users
  const handleDeleteUser = useCallback(async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      alert("Deleted successfully");
      reloadData();
    } catch {
      alert("Failed to delete");
    }
  }, [reloadData]);

  return { toggleSelect, selectAll, deleteSelected, deleteAll, handleEditUser, handleDeleteUser };
}
