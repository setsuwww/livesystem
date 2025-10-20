"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import useSWR from "swr"
import { handleOffices } from "../handlers/handleOffices"

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()
  return Array.isArray(data) ? data : data.data || []
}

export function useOfficesHooks(initialData = []) {
  const { data: offices = [], mutate } = useSWR("/api/office", fetcher)

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState([])

  const searchRef = useRef(null)

  // Filtering lokal
  const filteredData = useMemo(() => {
    return offices.filter((office) => {
      const matchesSearch =
        office.name.toLowerCase().includes(search.toLowerCase()) ||
        office.location.toLowerCase().includes(search.toLowerCase())

      const matchesType = typeFilter === "all" || office.type === typeFilter
      const matchesStatus = statusFilter === "all" || office.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [offices, search, typeFilter, statusFilter])

  // Bulk action handlers
  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const handleDeleteAll = useCallback(() => {
    handleOffices.onDeleteAll?.(mutate)
  }, [mutate])

  const handleDeleteSelected = useCallback(() => {
    handleOffices.onDeleteSelected?.(selectedIds, mutate)
  }, [selectedIds, mutate])

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
    mutate,
  }
}
