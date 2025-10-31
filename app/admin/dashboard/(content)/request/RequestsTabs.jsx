"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/Tabs"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/_components/ui/Table"
import { Button } from "@/_components/ui/Button"
import RequestsTableRow from "./RequestsTableRow"

export default function RequestsTabs({
  shiftRequests = [],
  permissionRequests = [],
  mode: initialMode = "pending",
}) {
  const [mode, setMode] = useState(initialMode)
  const isHistory = mode === "history"

  const toggleMode = () => setMode(isHistory ? "pending" : "history")

  const filteredShift = shiftRequests.filter((r) => isHistory ? true : r.status === "PENDING")
  const filteredPermission = permissionRequests.filter((r) => isHistory ? true : r.status === "PENDING")

  return (
    <Tabs defaultValue="shift" className="w-full">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="shift" className="px-4 py-4 flex items-center justify-center whitespace-nowrap">
            Shift Changes
          </TabsTrigger>
          <TabsTrigger value="permission" className="px-4 py-4 flex items-center justify-center whitespace-nowrap">
            Permissions
          </TabsTrigger>
        </TabsList>

        <div>
          <Button variant="outline" onClick={toggleMode} className="border-slate-200 shadow-xs">
            <span className="font-semibold text-slate-600">Request:</span>
            <span className="text-slate-400">{isHistory ? "Pending" : "Finished"}</span>
          </Button>
        </div>
      </div>

      <TabsContent value="shift" className="mt-6">
        {filteredShift.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-slate-400">
              {isHistory ? "No shift change records found" : "No pending shift change requests"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requested By</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead>Shift Change</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShift.map((request) => (
                <RequestsTableRow key={request.id} {...request} requestType="shift" />
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>

      <TabsContent value="permission" className="mt-6">
        {filteredPermission.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-slate-400">
              {isHistory ? "No permission records found" : "No pending permission requests"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requested By</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermission.map((request) => (
                <RequestsTableRow key={request.id} {...request} requestType="permission" />
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  )
}
