"use client";

import React from "react"
import { FolderInput, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const EmployeesActionHeader = React.memo(function EmployeesActionHeader ({ 
  search, setSearch, selected,
  onDeleteSelected, onDeleteAll,
  onExport,
}) {
  return (
    <div className="flex justify-between gap-2">
      <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-1/3"
      />
      <div className="flex items-center gap-x-2">
        <Button variant="ghost" className="text-red-500" size="sm" onClick={onDeleteSelected} disabled={!selected.length}>
          Delete Selected
        </Button>
        <Button variant="ghost" className="bg-red-50 text-red-500 hover:bg-red-100" size="sm" onClick={onDeleteAll}>
          <Trash2 />
          Delete All
        </Button>
        <Button variant="ghost" className="bg-green-100 text-green-600 hover:bg-green-200" size="sm" onClick={onExport}>
          <FolderInput />
          Export
        </Button>
      </div>
    </div>
  );
})
