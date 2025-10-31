"use client";

import { useState, useTransition } from "react";
import { Button } from "@/_components/ui/Button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/_components/ui/Dropdown-menu";
import { ChevronDown, Loader } from "lucide-react";
import { dotStatusColor, getDisplayStatus } from "@/_constants/attedanceConstants";

export default function RequestStatusChangerToggle({
  requestId, status,
  disabled,
  onReject, onStatusChange,
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus) => {
    if (newStatus === current) return;
    if (newStatus === "REJECTED") {
      onReject?.();
      return;
    }

    startTransition(() => { onStatusChange?.(newStatus);
      setCurrent(newStatus);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || isPending} className="border-slate-200 text-slate-400 text-sm font-semibold rounded-full flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dotStatusColor[current]}`} />
          <span>
            {getDisplayStatus(current)}
          </span>
          {isPending 
            ? (<Loader className="w-3.5 h-3.5 animate-spin" />) 
            : (<ChevronDown className="w-4 h-4 text-slate-400" />)
          }
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => handleChange("APPROVED")} className="text-emerald-500 focus:bg-emerald-50 focus:text-emerald-600">
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("REJECTED")} className="text-rose-500 focus:bg-rose-50 focus:text-rose-700">
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
