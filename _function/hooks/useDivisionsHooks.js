"use client"

import useSWR from "swr"
import { useState, useMemo } from "react"
import { handleDivisions } from "../handlers/handleDivisions"

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useDivisionsHooks(initialData) {
  const { data, mutate } = useSWR("/api/divisions", fetcher, { fallbackData: initialData })

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState([])

  const filteredData = useMemo(() => {
    return initialData.filter((division) => {
      const matchSearch = division.name.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === "all" || division.type === typeFilter
      const matchStatus = statusFilter === "all" || division.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [initialData, search, typeFilter, statusFilter])

  const divisionActions = handleDivisions({
    filteredData,
    selectedIds,
    setSelectedIds,
    mutate,
  })

  return {
    mutate,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filteredData,
    selectedIds,
    ...divisionActions,
  }
}
