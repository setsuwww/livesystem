"use client"

import { useState } from "react"

export default function CheckinButton({ shiftId }) {
  const [loading, setLoading] = useState(false)

  const handleCheckin = async () => {
    setLoading(true)
    const res = await fetch("/api/attendance/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId }),
    })
    setLoading(false)
    if (res.ok) alert("Check-in berhasil ✅")
    else alert("Gagal check-in ❌")
  }

  return (
    <button onClick={handleCheckin} disabled={loading}>
      {loading ? "Loading..." : "Check-in"}
    </button>
  )
}
