import { Badge } from "@/components/ui/Badge"

export function OfficesStatusBadge({ status }) {
  const isActive = status === "ACTIVE"

  return (
    <Badge variant="outline" className="flex items-center border-zinc-200 gap-2 px-2.5 py-1 rounded-full">
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
            isActive ? "bg-green-300" : "bg-red-400"
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isActive ? "bg-green-500" : "bg-red-600"
          }`}
        ></span>
      </span>
      <span className="text-xs font-semibold text-zinc-600">
        {isActive ? "Active" : "Inactive"}
      </span>
    </Badge>
  )
}
