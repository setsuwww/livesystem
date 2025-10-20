import { useRouter } from "next/navigation";

import { api } from "@/_lib/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const handleUsers = (selectedIds, setSelectedIds, filteredData, reloadData) => {
  const router = useRouter()

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);

  const selectAll = () => setSelectedIds(prev => prev.length === filteredData.length ? [] : filteredData.map(u => u.id));

  const deleteSelected = async () => { if (selectedIds.length === 0) return;
    try { await api.delete("/users", { data: { ids: selectedIds } });
      alert("Deleted successfully");
      reloadData();
    } 
    catch { alert("Failed to delete selected")}
  };

  const deleteAll = async () => { if (filteredData.length === 0) return;
    try { await api.delete("/users", { data: { ids: filteredData.map(u => u.id) } });
      alert("All deleted");
      reloadData();
    } catch { alert("Failed to delete all")}
  };

  const handleEditUser = (id) => router.push(`/admin/dashboard/users/${id}/edit`);

  const handleDeleteUser = async (id) => { const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    
    try { await api.delete(`/users/${id}`);
      alert("Deleted successfully");
      reloadData();
    } catch { alert("Failed to delete")}
  };

  const onExportPDF = (filteredData) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Schedule Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = filteredData.map((item) => [
      item.id, item.name, item.email,
      new Date(item.createdAt).toLocaleDateString(),
      new Date(item.updatedAt).toLocaleDateString(),
    ]);

    autoTable(doc, { head: [["ID", "Title", "Description", "Date", "Created At"]],
      body: tableData,
      startY: 40,
    });

    doc.save("userReport.pdf");
  };

  return { toggleSelect, selectAll, deleteSelected, deleteAll, handleEditUser, handleDeleteUser, onExportPDF };
}
