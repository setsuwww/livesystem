"use client";

import { useState, useTransition } from "react";
import { Button } from "@/_components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/_components/ui/Dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RequestStatusChangerToggle({
  requestId,
  status,
  disabled,
  onReject, // ⬅️ callback dari parent untuk buka dialog
  onStatusChange, // opsional callback biar parent refresh
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus) => {
    if (newStatus === "REJECTED") {
      onReject?.();
      return;
    }

    if (newStatus === current) return;
    onStatusChange?.(newStatus);
  };

  const dotStatusColor = {
    PENDING: "bg-yellow-500",
    PENDING_TARGET: "bg-slate-500",
    PENDING_ADMIN: "bg-slate-500",
    ACCEPTED: "bg-teal-500",
    REJECTED: "bg-rose-500",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isPending}
          className="rounded-full flex items-center gap-2"
        >
          <span className={`w-2 h-2 rounded-full ${dotStatusColor[current]}`} />
          <span className="capitalize">{current.toLowerCase().replace("_", " ")}</span>
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => handleChange("PENDING")}>
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChange("ACCEPTED")}
          className="text-teal-500 focus:bg-teal-50 focus:text-teal-700"
        >
          Accept
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChange("REJECTED")}
          className="text-rose-500 focus:bg-rose-50 focus:text-rose-700"
        >
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
