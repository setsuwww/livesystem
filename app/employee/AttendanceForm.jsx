"use client"
import { useState } from "react"

export default function AttendanceForm({ shiftId }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleAction = async (type) => {
    setLoading(true)
    setMessage("")

    const res = await fetch(`/api/attendance/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId }),
    })

    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setMessage(`${type === "checkin" ? "Check-in" : "Check-out"} berhasil ✅`)
      console.log("attendance:", data.attendance)
    } else {
      const err = await res.json()
      setMessage(err.error || "Terjadi kesalahan ❌")
    }
  }

  return (
    <div className="p-4 border rounded-lg w-full max-w-sm mx-auto text-center space-y-3">
      <h2 className="text-lg font-bold">Absensi Shift #{shiftId}</h2>

      <button
        onClick={() => handleAction("checkin")}
        disabled={loading}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Loading..." : "Check-in"}
      </button>

      <button
        onClick={() => handleAction("checkout")}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Loading..." : "Check-out"}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  )
}
