"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import RequestsTable from "./RequestsTable"
import { cn } from "@/lib/utils"

export default function RequestsTabs({ shiftRequests = [], permissionRequests = [] }) {
  const [tab, setTab] = useState("shift")

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-md p-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList
          className={cn(
            "mb-6 w-full grid grid-cols-2 rounded-lg bg-slate-100/60 p-1",
            "shadow-inner border border-slate-200"
          )}
        >
          <TabsTrigger
            value="shift"
            className={cn(
              "rounded-md py-2 text-sm font-medium transition-all duration-200",
              "data-[state=active]:bg-white data-[state=active]:shadow-sm",
              "data-[state=active]:text-sky-700 data-[state=active]:border-sky-300",
              "hover:text-sky-600"
            )}
          >
            <span className="inline-flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              Shift Change Requests
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="permission"
            className={cn(
              "rounded-md py-2 text-sm font-medium transition-all duration-200",
              "data-[state=active]:bg-white data-[state=active]:shadow-sm",
              "data-[state=active]:text-purple-700 data-[state=active]:border-purple-300",
              "hover:text-purple-600"
            )}
          >
            <span className="inline-flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              Permission Requests
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-2">
          <TabsContent value="shift">
            <RequestsTable data={shiftRequests} type="Shift Change" />
          </TabsContent>

          <TabsContent value="permission">
            <RequestsTable data={permissionRequests} type="Permission" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
