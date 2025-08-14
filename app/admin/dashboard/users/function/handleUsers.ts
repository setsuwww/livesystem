import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export const handleUsers = ( selectedIds: number[], setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>, filteredData: any[], reloadData: () => void) => {
  const router = useRouter()

  // Toggle Select combobox
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  // Toggle Selectall combobox
  const selectAll = () => {
    setSelectedIds(prev => prev.length === filteredData.length ? [] : filteredData.map(u => u.id));
  };

  // Menghapus semua yang di select
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;

    try { await api.delete("/users", { data: { ids: selectedIds } });
      alert("Deleted successfully");
      reloadData();
    } catch {
      alert("Failed to delete selected");
    }
  };

  // Menghapus semua
  const deleteAll = async () => {
    if (filteredData.length === 0) return;

    try { await api.delete("/users", { data: { ids: filteredData.map(u => u.id) } });
      alert("All deleted");
      reloadData();
    } catch {
      alert("Failed to delete all");
    }
  };

  // Edit users
  const handleEditUser = (id: number) => {
    router.push(`/admin/dashboard/users/${id}/edit`); // Sesuaikan rute edit kamu
  };

  // Delete users
  const handleDeleteUser = async (id: number) => {
    try { await api.delete(`/users/${id}`);
      alert("Deleted successfully");
      reloadData();
    } catch {
      alert("Failed to delete");
    }
  };

  return { toggleSelect, selectAll, deleteSelected, deleteAll, handleEditUser, handleDeleteUser };
}
