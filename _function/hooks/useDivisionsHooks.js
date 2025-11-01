"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { handleDivisions } from "../handlers/handleDivisions"

export function useDivisionsHooks(initialData) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState([])

  const searchRef = useRef(null)

  const filteredData = useMemo(() => {
    return initialData.filter((division) => {
      const matchSearch = division.name.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === "all" || division.type === typeFilter
      const matchStatus = statusFilter === "all" || division.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [initialData, search, typeFilter, statusFilter])

  const {
    toggleSelect,
    toggleSelectAll,
    isAllSelected,
    onEdit,
    onDelete,
    handleDeleteSelected,
    handleDeleteAll,
    onToggleStatus,
    onBulkUpdate,
    onExportPDF,
  } = handleDivisions({ filteredData, selectedIds, setSelectedIds })

  return {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filteredData,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isAllSelected,
    handleDeleteSelected,
    handleDeleteAll,
    onEdit,
    onDelete,
    onToggleStatus,
    onBulkUpdate,
    onExportPDF,
    searchRef,
  }
}
