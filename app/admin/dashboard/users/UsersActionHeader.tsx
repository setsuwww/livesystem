"use client"

import React from "react"
import { Trash2 } from "lucide-react"

import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { UsersActionHeaderProps } from "@/static/interfaces/UsersActionHeaderProps"

export function UsersActionHeader({ search, onSearchChange, roleFilter, onRoleFilterChange, shiftFilter, onShiftFilterChange, selectedCount, onDeleteSelected, onDeleteAll }: UsersActionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">

      {/* Search & Filters */}
      <div className="flex items-center gap-2">
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-gray-700 mr-1">Role:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
          </SelectContent>
        </Select>

        <Select value={shiftFilter} onValueChange={onShiftFilterChange}>
          <SelectTrigger className="w-auto px-3 whitespace-nowrap">
            <span className="font-semibold text-gray-700 mr-1">Shift:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="MORNING">Morning</SelectItem>
            <SelectItem value="AFTERNOON">Afternoon</SelectItem>
            <SelectItem value="NIGHT">Night</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Search..." value={search} onChange={e => onSearchChange(e.target.value)} className="w-full sm:w-64 bg-white py-2"/>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="destructive" size="sm"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}>
          Delete Selected ({selectedCount})
        </Button>

        <Button variant="destructive" size="sm" onClick={onDeleteAll}>
          <Trash2 size={18} strokeWidth={2} />
          Delete All
        </Button>
      </div>
    </div>
  )
}