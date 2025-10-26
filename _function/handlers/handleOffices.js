"use client"

import { toast } from "sonner"

export const handleDivisions = {
  async onEdit(division) {
    toast.info(`Edit ${division.name}`)
    router.push(`/admin/dashboard/divisions/${division.id}/edit`)
  },

  async onDelete(divisionId, mutate) {
    try { const res = await fetch(`/api/division/${divisionId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete division")

      toast.success("division deleted")
      mutate && mutate()
    } catch (err) { toast.error("Error deleting division")
      console.error(err)
    }
  },

  async onBulkUpdate({ activateType, deactivateType, isActive }) {
    await fetch("/api/division", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activateType, deactivateType, isActive }),
    })
  },

  async onToggleStatus(division, mutate) { 
    const newStatus = division.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    await fetch(`/api/division/${division.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    mutate && mutate()
  },
}
