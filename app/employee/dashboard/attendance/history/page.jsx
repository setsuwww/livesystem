"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Loader2, Clock, CalendarDays } from "lucide-react"

export default function AttendanceHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/users/history/attendance")
        if (!res.ok) throw new Error("Failed to fetch history")
        const data = await res.json()
        setHistory(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading attendance history...
      </div>
    )
  }

  return (
    <div className="mx-auto mt-10 space-y-6">
      <Card className="shadow-md border border-gray-200/60">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-500" />
            Attendance History
          </CardTitle>
        </CardHeader>

        <CardContent className="divide-y divide-slate-200">
          {history.length === 0 ? (
            <p className="text-center py-6 text-slate-500">
              No attendance records found.
            </p>
          ) : (
            history.map((att) => (
              <div
                key={att.id}
                className="flex flex-col md:flex-row md:items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">
                      {new Date(att.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-slate-500">
                      Shift: {att.shift?.name || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-2 md:mt-0 flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`border ${
                      att.status === "PRESENT"
                        ? "border-green-500 text-green-600 bg-green-50"
                        : att.status === "LATE"
                        ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                        : att.status === "PERMISSION"
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : att.status === "ABSENT"
                        ? "border-gray-400 text-gray-600 bg-gray-50"
                        : "border-red-500 text-red-600 bg-red-50"
                    }`}
                  >
                    {att.status}
                  </Badge>

                  {att.reason && (
                    <p className="text-sm text-slate-500 italic">
                      {att.reason}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
