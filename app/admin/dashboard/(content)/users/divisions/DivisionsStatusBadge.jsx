import { Badge } from "@/_components/ui/Badge"
import { ChevronUp, ChevronDown } from "lucide-react"

export function DivisionsStatusBadge({ status, onToggle }) {
  const isActive = status === "ACTIVE"

  return (
    <Badge variant="outline" onClick={onToggle}
      className="flex items-center gap-2 px-2.5 py-1 rounded-full cursor-pointer select-none border-slate-200 hover:bg-slate-50 transition"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
            isActive ? "bg-emerald-300" : "bg-rose-400"
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isActive ? "bg-emerald-500" : "bg-rose-600"
          }`}
        ></span>
      </span>

      <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
        <span>{isActive ? "Active" : "Inactive"}</span>
        {isActive ? (
          <ChevronUp className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-rose-600" />
        )}
      </div>
    </Badge>
  )
}
