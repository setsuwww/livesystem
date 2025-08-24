"use client";

import { Button } from "@/components/ui/Button";
import { RefreshCcw } from "lucide-react";

export default function EmployeesActionButton({ onSwitch, onEdit, onDelete }) {
  return (
    <div className="flex items-center space-x-2">
      <Button size="icon" variant="outline" onClick={onSwitch}>
        <RefreshCcw strokeWidth={1.5} />
      </Button>
      <Button size="sm" variant="outline" onClick={onEdit}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
