"use client"

import { useState } from "react"

export default function AttendanceForm({ shiftId }) {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("PRESENT")
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")

  const handleCheckin = async () => {
    setLoading(true)
    const res = await fetch("/api/attendance/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId }),
    })
    setLoading(false)
    if (res.ok) setMessage("Check-in berhasil ✅")
    else setMessage("Gagal check-in ❌")
  }

  const handleCheckout = async () => {
    setLoading(true)
    const res = await fetch("/api/attendance/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId }),
    })
    setLoading(false)
    if (res.ok) setMessage("Check-out berhasil ✅")
    else setMessage("Gagal check-out ❌")
  }

  const handlePermission = async () => {
    if (!reason) return setMessage("Isi alasan izin terlebih dahulu ❌")

    setLoading(true)
    const res = await fetch("/api/attendance/permission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId, reason }),
    })
    setLoading(false)
    if (res.ok) setMessage("Permission diajukan ✅")
    else setMessage("Gagal ajukan permission ❌")
  }

  return (
    <div className="p-4 border rounded-lg w-full max-w-sm mx-auto text-center space-y-3">
      <h2 className="text-lg font-bold">Absensi Shift #{shiftId}</h2>

      {/* Select mode */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="PRESENT">PRESENT</option>
        <option value="PERMISSION">PERMISSION</option>
      </select>

      {/* Jika PRESENT → checkin & checkout */}
      {mode === "PRESENT" && (
        <div className="space-y-2">
          <button
            onClick={handleCheckin}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Check-in"}
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Check-out"}
          </button>
        </div>
      )}

      {/* Jika PERMISSION → tampilkan alasan */}
      {mode === "PERMISSION" && (
        <div className="space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Masukkan alasan izin..."
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handlePermission}
            disabled={loading}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Ajukan Permission"}
          </button>
        </div>
      )}

      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  )
}
