import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Schedule } from "@/static/types/Schedule";

export const handleSchedules = ( selectedIds: number[], setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>, filteredData: Schedule[], reloadData: () => void) => {
  const router = useRouter();

  // Toggle Select 1 item
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Toggle Select All
  const selectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredData.length ? [] : filteredData.map((s) => s.id)
    );
  };

  // Delete Selected
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = confirm("Are you sure you want to delete selected schedules?");
    if (!confirmDelete) return;

    try { await api.delete("/schedules", { data: { ids: selectedIds } });
      alert("Deleted selected schedules ✅");
      setSelectedIds([]);
      reloadData();
    } 
    catch {
      alert("Failed to delete selected ❌");
    }
  };

  // Delete All
  const deleteAll = async () => {
    if (filteredData.length === 0) return;

    const confirmDelete = confirm("Are you sure you want to delete ALL schedules?");
    if (!confirmDelete) return;

    try { await api.delete("/schedules", {
        data: { ids: filteredData.map((s) => s.id) },
      });
      alert("All schedules deleted ✅");
      setSelectedIds([]);
      reloadData();
    } 
    catch {
      alert("Failed to delete all ❌");
    }
  };

  // ✅ Edit
  const handleEditSchedule = (id: number) => {
    router.push(`/admin/dashboard/schedules/${id}/edit`);
  };

  // ✅ Delete single schedule
  const handleDeleteSchedule = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this schedule?");
    if (!confirmDelete) return;

    try { await api.delete(`/schedules/${id}`);
      alert("Schedule deleted ✅");
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      reloadData();
    } 
    catch {
      alert("Failed to delete ❌");
    }
  };

  // ✅ Export PDF
  const onExportPDF = (filteredData: Schedule[]) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Schedules Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = filteredData.map((item) => [
      item.id,
      item.title,
      item.description,
      new Date(item.date).toLocaleDateString(),
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["ID", "Title", "Description", "Date", "Created At"]],
      body: tableData,
      startY: 40,
    });

    doc.save("scheduleReport.pdf");
  };

  return { toggleSelect, selectAll, deleteSelected, deleteAll, handleEditSchedule, handleDeleteSchedule, onExportPDF };
};
