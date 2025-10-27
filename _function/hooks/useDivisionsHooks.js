"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import useSWR from "swr"
import { handleDivisions } from "../handlers/handleDivisions"

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()
  return Array.isArray(data) ? data : data.data || []
}

export function useDivisionsHooks(initialData = []) {
  const { data: divisions = [], mutate } = useSWR("/api/division", fetcher)

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState([])

  const searchRef = useRef(null)

  const filteredData = useMemo(() => {
    return divisions.filter((division) => {
      const matchesSearch =
        division.name.toLowerCase().includes(search.toLowerCase()) ||
        division.location.toLowerCase().includes(search.toLowerCase())

      const matchesType = typeFilter === "all" || division.type === typeFilter
      const matchesStatus = statusFilter === "all" || division.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [divisions, search, typeFilter, statusFilter])

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const handleDeleteAll = useCallback(() => {
    handleDivisions.onDeleteAll?.(mutate)
  }, [mutate])

  const handleDeleteSelected = useCallback(() => {
    handleDivisions.onDeleteSelected?.(selectedIds, mutate)
  }, [selectedIds, mutate])

  const handleExportPDF = useCallback(() => {
    handleDivisions.onExportPDF?.(filteredData)
  }, [filteredData])

  const toggleSelect = (id) => {
  setSelectedIds((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  )
}

const toggleSelectAll = () => {
  if (selectedIds.length === filteredData.length) {
    setSelectedIds([])
  } else {
    setSelectedIds(filteredData.map((d) => d.id))
  }
}

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
