"use client"

import { useRouter } from "next/navigation"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { deleteUsers, deleteUserWithId } from "@/_components/server/userAction"
import { useToast } from "@/_components/client/Toast-Provider"

export const handleUsers = (selectedIds, setSelectedIds, filteredData, reloadData) => {
  const router = useRouter()
  const { addToast } = useToast()

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )

  const selectAll = () =>
    setSelectedIds((prev) =>
      prev.length === filteredData.length ? [] : filteredData.map((u) => u.id)
    )

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return
    try {
      const res = await deleteUsers(selectedIds)
      if (res.success) {
        addToast(res.message, { type: "success", title: "Success", description: "Selected users deleted." })
        reloadData()
      }
    } catch {
      addToast("Failed to delete selected users", { type: "error" })
    }
  }

  const deleteAll = async () => {
    if (filteredData.length === 0) return
    try {
      const res = await deleteUsers(filteredData.map((u) => u.id))
      if (res.success) {
        addToast(res.message, { type: "success", title: "Success" })
        reloadData()
      }
    } catch {
      addToast("Failed to delete all users", { type: "error" })
    }
  }

  const handleEditUser = (id) => router.push(`/admin/dashboard/users/${id}/edit`)

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      const res = await deleteUserWithId(id)
      if (res.success) {
        addToast("User deleted successfully", { type: "success" })
        reloadData()
      }
    } catch {
      addToast("Failed to delete user", { type: "error" })
    }
  }

  const onExportPDF = (filteredData) => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("User Report", 14, 22)
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    const tableData = filteredData.map((item) => [
      item.id,
      item.name,
      item.email,
      new Date(item.createdAt).toLocaleDateString(),
    ])

    autoTable(doc, {
      head: [["ID", "Name", "Email", "Created At"]],
      body: tableData,
      startY: 40,
    })

    doc.save("userReport.pdf")
  }

  return {
    toggleSelect,
    selectAll,
    deleteSelected,
    deleteAll,
    handleEditUser,
    handleDeleteUser,
    onExportPDF,
  }
}
