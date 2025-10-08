"use client"

import { toast } from "sonner"

export const handleOffices = {
  async onEdit(office) {
    toast.info(`Edit ${office.name}`)
    router.push(`/admin/dashboard/offices/${office.id}/edit`)
  },

  async onDelete(officeId, mutate) {
    try {
      const res = await fetch(`/api/office/${officeId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete office")

      toast.success("Office deleted")
      mutate && mutate() // refresh data kalau dikasih mutate dari hook
    } catch (err) {
      toast.error("Error deleting office")
      console.error(err)
    }
  },

  async onBulkUpdate({ activateType, deactivateType, isActive }) {
    await fetch("/api/office", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activateType, deactivateType, isActive }),
    })
  },

  async onToggleStatus(office, mutate) {
    const newStatus = office.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    await fetch(`/api/office/${office.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    mutate && mutate()
  },
}
