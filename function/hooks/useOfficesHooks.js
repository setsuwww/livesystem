"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { handleOffices } from "../handleOffices"

export function useOfficesHooks(initialData = []) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState([])

  const searchRef = useRef(null)

  const filteredData = useMemo(() => {
    return initialData.filter((office) => {
      const matchesSearch =
        office.name.toLowerCase().includes(search.toLowerCase()) ||
        office.location.toLowerCase().includes(search.toLowerCase())

      const matchesType =
        typeFilter === "all" || office.type === typeFilter

      const matchesStatus =
        statusFilter === "all" || office.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [initialData, search, typeFilter, statusFilter])

  // ✅ Select/Deselect office untuk bulk action
  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const handleDeleteAll = useCallback(() => {
    handleOffices.onDeleteAll?.()
  }, [])

  const handleDeleteSelected = useCallback(() => {
    handleOffices.onDeleteSelected?.(selectedIds)
  }, [selectedIds])

  const handleExportPDF = useCallback(() => {
    handleOffices.onExportPDF?.(filteredData)
  }, [filteredData])

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
    handleDeleteSelected,
    handleDeleteAll,
    handleExportPDF,
    searchRef,
  }
}
