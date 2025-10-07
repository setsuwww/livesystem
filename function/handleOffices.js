"use client"

import { toast } from "sonner"

export const handleOffices = {
  async onEdit(office) {
    toast.info(`Edit ${office.name}`)
    router.push(`/admin/dashboard/offices/${office.id}/edit`)
  },

  async onDelete(officeId, mutate) {
    try {
      const res = await fetch(`/api/offices/${officeId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete office")

      toast.success("Office deleted")
      mutate && mutate() // refresh data kalau dikasih mutate dari hook
    } catch (err) {
      toast.error("Error deleting office")
      console.error(err)
    }
  },

  async onToggleStatus(officeId, currentStatus, mutate) {
    try {
      const res = await fetch(`/api/offices/${officeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE" }),
      })
      if (!res.ok) throw new Error("Failed to update status")

      toast.success("Status updated")
      mutate && mutate()
    } catch (err) {
      toast.error("Error updating status")
      console.error(err)
    }
  },

  async onBulkUpdate({ ids, status }, mutate) {
    try {
      const res = await fetch(`/api/offices/bulk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      })
      if (!res.ok) throw new Error("Bulk update failed")

      toast.success("Bulk update successful")
      mutate && mutate()
    } catch (err) {
      toast.error("Error in bulk update")
      console.error(err)
    }
  },
}
