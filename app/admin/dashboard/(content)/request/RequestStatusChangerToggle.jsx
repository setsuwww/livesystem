"use client"

import { useState } from "react"
import { Button } from "@/_components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/_components/ui/Dropdown-menu"
import { ChevronDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RequestStatusChangerToggle({ status, onChange, disabled }) {
  const [current, setCurrent] = useState(status)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = async (newStatus) => {
    if (newStatus === current) return
    setIsLoading(true)
    try {
      await onChange(newStatus)
      setCurrent(newStatus)
      toast.success(`Status updated to ${newStatus}`)
    } catch (e) {
      toast.error("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  const statusColor = {
    PENDING: "bg-yellow-500",
    PENDING_TARGET: "bg-slate-500",
    PENDING_ADMIN: "bg-slate-500",
    ACCEPTED: "bg-teal-500",
    REJECTED: "bg-rose-500",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || isLoading} className="rounded-full flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColor[current]}`}/>
          <span className="capitalize">{current.toLowerCase().replace("_", " ")}</span>
          {isLoading ? (
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
  )
}
