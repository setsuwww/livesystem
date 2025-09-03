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
      <div className="flex gap-2">
        <Button size="sm" variant="destructive" onClick={onDeleteSelected} disabled={!selected.length}>
          Delete Selected <span className="bg-white text-xs font-semibold px-1 rounded-md text-red-500">{selected.length}</span>
        </Button>
        <Button size="sm" variant="destructive" onClick={onDeleteAll}>
          <Trash2 />
          Delete All
        </Button>
        <Button size="sm" onClick={onExport} className="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600">
          <FolderInput />
          Export
        </Button>
      </div>
    </div>
  );
})
