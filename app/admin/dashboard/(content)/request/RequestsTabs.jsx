"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/Tabs"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/_components/ui/Table"
import { Badge } from "@/_components/ui/Badge"
import RequestsTableRow from "./RequestsTableRow"

export default function RequestsTabs({ shiftRequests = [], permissionRequests = [] }) {
  return (
    <Tabs defaultValue="shift" className="w-full">
      <TabsList>
        <TabsTrigger value="shift" className="px-4 py-4 flex items-center justify-center whitespace-nowrap">
          Shift Changes
        </TabsTrigger>
        <TabsTrigger value="permission" className="px-4 py-4 flex items-center justify-center whitespace-nowrap">
          Permissions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="shift" className="mt-6">
        {shiftRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No pending shift change requests</p>
          </div>
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>Shift Change</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftRequests.map((request) => (
                  <RequestsTableRow key={request.id} {...request} requestType="shift" />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="permission" className="mt-6">
        {permissionRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No pending permission requests</p>
          </div>
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionRequests.map((request) => (
                  <RequestsTableRow key={request.id} {...request} requestType="permission" />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}