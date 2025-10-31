"use client"

import { useCallback } from "react"
import { deleteUsers, deleteUserWithId, getUserWithId } from "@/_components/server/userAction"
import { exportUser } from "@/_function/exports/exportUser"
import { useToast } from "@/_components/client/Toast-Provider"

export function handleUsers({ filteredData, selectedIds, setSelectedIds }) {
  const { addToast } = useToast()

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }, [setSelectedIds])

  const selectAll = useCallback((checked) => { if (checked) setSelectedIds(filteredData.map((u) => u.id))
    else setSelectedIds([])
  }, [filteredData, setSelectedIds])

  const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length

  const deleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) {
      addToast("No users selected", { type: "warning" })
      return
    }

    if (!confirm(`Delete ${selectedIds.length} selected users?`)) return

    try { await deleteUsers(selectedIds)
      addToast("Selected users deleted", { type: "success" })
      setSelectedIds([])
    } 
    catch (err) { console.error(err)
      addToast("Failed to delete selected users", { type: "error" })
    }
  }, [selectedIds, addToast, setSelectedIds])

  const deleteAll = useCallback(async () => {
    if (!confirm("Delete ALL users?")) return
    try { await deleteUsers(filteredData.map((u) => u.id))
      addToast("All users deleted", { type: "success" })
      setSelectedIds([])
    } catch (err) {
      console.error(err)
      addToast("Failed to delete all users", { type: "error" })
    }
  }, [filteredData, addToast, setSelectedIds])

  const handleEditUser = useCallback(async (id) => {
    try { const user = await getUserWithId(id)
      if (!user) return addToast("User not found", { type: "error" })
      console.log("Editing user:", user)
      addToast(`Editing ${user.name}`, { type: "info" })
    } 
    catch (err) { console.error(err)
      addToast("Failed to load user data", { type: "error" })
    }
  }, [addToast])

  const handleDeleteUser = useCallback(async (id) => {
    if (!confirm("Delete this user?")) return
    try { await deleteUserWithId(id)
      addToast("User deleted", { type: "success" })
      setSelectedIds((prev) => prev.filter((x) => x !== id))
    } 
    catch (err) { console.error(err)
      addToast("Failed to delete user", { type: "error" })
    }
  }, [addToast, setSelectedIds])

  const onExportPDF = useCallback((data) => {
    exportUser(data)
    addToast("PDF exported successfully", { type: "success" })
  }, [addToast])

  return {
    toggleSelect, selectAll,
    isAllSelected, deleteSelected, deleteAll,
    handleEditUser, handleDeleteUser,
    onExportPDF,
  }
}
