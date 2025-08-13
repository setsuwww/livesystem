"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Trash2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

import { UsersTableAction } from "./UsersActionButton"
import { api } from "@/lib/api"

type User = {
  id: number
  name: string
  email: string
  role: string
  shift: string
  createdAt: string
}

interface UsersTableProps {
  data: User[]
}

export default function UsersTable({ data }: UsersTableProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [shiftFilter, setShiftFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const filteredData = useMemo(() => {
    return data.filter(user => {
      const matchSearch =
        search === "" ||
        Object.values(user).join(" ").toLowerCase().includes(search.toLowerCase())

      const matchRole = roleFilter === "all" || user.role === roleFilter
      const matchShift = shiftFilter === "all" || user.shift === shiftFilter

      return matchSearch && matchRole && matchShift
    })
  }, [data, search, roleFilter, shiftFilter])

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]))
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(prev => (prev.length === filteredData.length ? [] : filteredData.map(u => u.id)))
  }, [filteredData])

  // Delete selected
  const deleteSelected = useCallback(async () => {
    try {
      await api.delete("/users", { data: { ids: selectedIds } })
      alert("Deleted successfully")
      location.reload()
    } catch {
      alert("Failed to delete selected")
    }
  }, [selectedIds])

  // Delete all
  const deleteAll = useCallback(async () => {
    try {
      await api.delete("/users", { data: { ids: filteredData.map(u => u.id) } })
      alert("All deleted")
      location.reload()
    } catch {
      alert("Failed to delete all")
    }
  }, [filteredData])

  // Edit user
  const handleEditUser = useCallback(async (id: number) => {
    const name = prompt("Enter new name:")
    if (!name) return
    try {
      await api.patch(`/users/${id}`, { name })
      alert("Updated successfully")
      location.reload()
    } catch {
      alert("Failed to update")
    }
  }, [])

  const handleDeleteUser = useCallback(async (id: number) => {
    try {
      await api.delete(`/users/${id}`)
      alert("Deleted successfully")
      location.reload()
    } catch {
      alert("Failed to delete")
    }
  }, [])

  return (
    <div className="rounded-md space-y-4">
      {/* Filter & Search */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-white py-2"
          />

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-auto px-3 whitespace-nowrap">
              <span className="font-semibold text-gray-700 mr-1">Filter:</span>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Role</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>

          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-auto px-3 whitespace-nowrap">
              <span className="font-semibold text-gray-700 mr-1">Filter:</span>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shift</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={deleteSelected}
            disabled={selectedIds.length === 0}
          >
            Delete Selected ({selectedIds.length})
          </Button>

          <Button variant="destructive" size="sm" onClick={deleteAll}>
            <Trash2 size={18} strokeWidth={2} />
            Delete All
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                onChange={selectAll}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                  />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.shift}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">
                  <UsersTableAction
                    userId={user.id}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
