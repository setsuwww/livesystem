"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/_components/ui/Tabs"
import { Button } from "@/_components/ui/Button"
import { History } from "lucide-react"
import RequestsTable from "./RequestsTable"
import { cn } from "@/_lib/utils"

export default function RequestsTabs({ shiftRequests = [], permissionRequests = [] }) {
  const [tab, setTab] = useState("shift")

  return (
    <div className="border-slate-200 bg-white/70 backdrop-blur-md">
      {/* Header atas: Tabs di kiri, History di kanan */}
      <div className="flex items-center justify-between mb-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex gap-1 bg-slate-50 p-0">
            <TabsTrigger
              value="shift"
              className={cn(
                "shadow-none inline-flex items-center whitespace-nowrap relative pb-2 text-sm font-medium text-slate-600 transition-colors",
                "hover:text-slate-900",
                "data-[state=active]:text-sky-700 data-[state=active]:shadow-xs data-[state=active]:border-b-2 data-[state=active]:border-sky-500",
              )}
            >
              Shift Change
            </TabsTrigger>

            <TabsTrigger
              value="permission"
              className={cn(
                "inline-flex items-center whitespace-nowrap relative pb-2 text-sm font-medium text-slate-600 transition-colors",
                "hover:text-slate-900",
                "data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-500",
              )}
            >
              Permission
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tombol History */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
      </div>

      {/* Konten tabel */}
      <div className="mt-2">
        {tab === "shift" ? (
          <RequestsTable data={shiftRequests} type="Shift Change" />
        ) : (
          <RequestsTable data={permissionRequests} type="Permission" />
        )}
      </div>
    </div>
  )
}
