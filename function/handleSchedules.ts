import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Schedule } from "@/static/types/Schedule";

export const toggleSelectAll = (
  checked: boolean,
  filteredData: Schedule[],
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
) => {
  setSelectedIds(checked ? filteredData.map((item) => item.id) : []);
};

export const toggleSelectItem = (
  id: number,
  checked: boolean,
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
) => {
  setSelectedIds((prev) =>
    checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
  );
};

export const handleDeleteSelected = (
  selectedIds: number[],
  onDeleteMultiple?: (ids: number[]) => void,
  setSelectedIds?: React.Dispatch<React.SetStateAction<number[]>>
) => {
  if (selectedIds.length > 0 && onDeleteMultiple) {
    onDeleteMultiple(selectedIds);
    setSelectedIds?.([]);
  }
};

export const handleDeleteAll = (
  filteredData: Schedule[],
  onDeleteMultiple?: (ids: number[]) => void,
  setSelectedIds?: React.Dispatch<React.SetStateAction<number[]>>
) => {
  if (filteredData.length > 0 && onDeleteMultiple) {
    onDeleteMultiple(filteredData.map((item) => item.id));
    setSelectedIds?.([]);
  }
};

export const exportToPDF = (filteredData: Schedule[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Schedule Report", 14, 22);
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
