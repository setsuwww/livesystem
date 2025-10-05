import { Badge } from "@/components/ui/Badge"

export function OfficesStatusBadge({ status, onToggle }) {
  const isActive = status === "ACTIVE"

  return (
    <Badge
      variant="outline"
      onClick={onToggle}
      className={`flex items-center border-slate-200 gap-2 px-2.5 py-1 rounded-full cursor-pointer select-none transition 
      ${isActive ? "hover:bg-teal-50" : "hover:bg-rose-50"}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
            isActive ? "bg-teal-300" : "bg-rose-400"
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isActive ? "bg-teal-500" : "bg-rose-600"
          }`}
        ></span>
      </span>
      <span className="text-xs font-semibold text-slate-600">
        {isActive ? "Active" : "Inactive"}
      </span>
    </Badge>
  )
}
