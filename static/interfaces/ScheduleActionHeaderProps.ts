export interface ScheduleActionHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  sortOrder: "newest" | "oldest";
  onSortChange: (value: "newest" | "oldest") => void;
  selectedCount: number;
  totalCount: number;
  onDeleteSelected: () => void;
  onDeleteAll: () => void;
  onExportPDF: () => void;
}