"use client"

import { CircleUserRound } from "lucide-react"

export default function RenderUserInfo({ person }) {
  if (!person) return <span>-</span>

  return (
    <div className="flex items-start gap-2">
      <div className="bg-slate-200 p-2 rounded-full">
        <CircleUserRound className="h-5 w-5 text-slate-600" strokeWidth={1} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-600">{person.name}</p>
        <p className="text-xs text-slate-400">{person.email}</p>
        {person.division?.name && (
          <p className="text-xs font-medium text-purple-500">
            {person.division.name}
          </p>
        )}
      </div>
    </div>
  )
}
