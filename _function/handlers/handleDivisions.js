"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCallback } from "react"

export function handleDivisions({ filteredData, selectedIds, setSelectedIds, mutate }) {
  const router = useRouter()

  const toggleSelect = useCallback(
    (id) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      )
    },
    [setSelectedIds]
  )

  const toggleSelectAll = useCallback(
    (checked) => {
      if (checked) setSelectedIds(filteredData.map((d) => d.id))
      else setSelectedIds([])
    },
    [filteredData, setSelectedIds]
  )

  const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length

  const onEdit = useCallback(
    (division) => {
      toast.info(`Editing ${division.name}`)
      router.push(`/admin/dashboard/divisions/${division.id}/edit`)
    },
    [router]
  )

  const onDelete = useCallback(
    async (divisionId) => {
      if (!confirm("Delete this division?")) return
      try { const res = await fetch(`/api/division/${divisionId}`, { method: "DELETE" })
        if (!res.ok) throw new Error("Failed to delete division")

        toast.success("Division deleted")
        setSelectedIds((prev) => prev.filter((x) => x !== divisionId))
        mutate && mutate()
      } 
      catch (err) { console.error(err)
        toast.error("Error deleting division")
      }
    },
    [mutate, setSelectedIds]
  )

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) {
      toast.warning("No divisions selected")
      return
    }

    if (!confirm(`Delete ${selectedIds.length} selected divisions?`)) return
    try { await Promise.all(selectedIds.map((id) => fetch(`/api/division/${id}`, { method: "DELETE" })))
      toast.success("Selected divisions deleted")
      setSelectedIds([])
      mutate && mutate()
    } 
    catch (err) { console.error(err)
      toast.error("Failed to delete selected divisions")
    }
  }, [selectedIds, mutate, setSelectedIds])

  const handleDeleteAll = useCallback(async () => {
    if (!confirm("Delete ALL divisions?")) return
    try { await Promise.all(filteredData.map((d) => fetch(`/api/division/${d.id}`, { method: "DELETE" })))
      toast.success("All divisions deleted")
      setSelectedIds([])
      mutate && mutate()
    } 
    catch (err) {console.error(err)
      toast.error("Failed to delete all divisions")
    }
  }, [filteredData, mutate, setSelectedIds])

  const onToggleStatus = useCallback(async (division) => {
    const newStatus = division.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    try { await fetch(`/api/division/${division.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      toast.success(`Division ${newStatus}`)
      mutate && mutate()
    } 
    catch (err) { console.error(err)
      toast.error("Failed to toggle status")
    }
  }, [mutate])

  const onBulkUpdate = useCallback(async ({ activateType, deactivateType, isActive }) => {
    try { await fetch("/api/division", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activateType, deactivateType, isActive }),
      })
      toast.success("Divisions bulk updated")
    } 
    catch (err) { console.error(err)
      toast.error("Bulk update failed")
    }
  }, [])

  const onExportPDF = useCallback((data) => {
    toast.success(`Exported ${data.length} divisions to PDF`)
  }, [])

  return {
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
  }
}
