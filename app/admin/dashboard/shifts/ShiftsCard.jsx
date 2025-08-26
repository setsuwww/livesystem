"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Clock, AlertCircle, CheckCircle2, XCircle, Timer } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"

const statusConfig = {
  PRESENT: {
    color: "emerald",
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  ABSENT: {
    color: "red",
    icon: XCircle,
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
  },
  LATE: {
    color: "yellow",
    icon: Timer,
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  PERMISSION: {
    color: "blue",
    icon: AlertCircle,
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
  },
}

const shiftStyles = {
  morning:
    "bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800",
  afternoon:
    "bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  evening:
    "bg-gradient-to-r from-fuchsia-500/10 to-yellow-500/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-800",
  night:
    "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
const formatTimeRange = (start, end) => {
  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  return `${formatTime(start)} - ${formatTime(end)}`
}

export default function ShiftCards({ shifts = [] }) {
  const [selectedShift, setSelectedShift] = useState(null)

  const handleOpen = useCallback((shift) => {
    setSelectedShift(shift)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedShift(null)
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        <div>
          {shifts.map((shift, index) => {
            const statusCounts = {
              PRESENT: shift.users?.filter((u) => u.attendanceStatus === "PRESENT").length || 0,
              ABSENT: shift.users?.filter((u) => u.attendanceStatus === "ABSENT").length || 0,
              LATE: shift.users?.filter((u) => u.attendanceStatus === "LATE").length || 0,
              PERMISSION: shift.users?.filter((u) => u.attendanceStatus === "PERMISSION").length || 0,
            }

            const worstStatus =
              ["ABSENT", "LATE", "PERMISSION", "PRESENT"].find((status) => statusCounts[status] > 0) || "PRESENT"

            const presentCount = statusCounts.PRESENT
            const totalUsers = shift.users?.length || 0
            const isAllPresent = worstStatus === "PRESENT" && presentCount === totalUsers
            const attendanceRate = totalUsers > 0 ? (presentCount / totalUsers) * 100 : 100

            return (
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handleOpen(shift)}
              >
                {!isAllPresent && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    {["ABSENT", "LATE", "PERMISSION"].map((status) => {
                      if (statusCounts[status] === 0) return null
                      const config = statusConfig[status]
                      const Icon = config.icon
                      return (
                        <motion.div
                          key={status}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`flex items-center justify-center w-6 h-6 rounded-full ${config.bg} ${config.border}`}
                        >
                          <Icon className={`w-3 h-3 ${config.text}`} />
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium ${shiftStyles[shift.type] || shiftStyles.morning}`}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {capitalize(shift.type)} Shift
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
                    >
                      <span className="text-xs font-mono">
                        {formatTimeRange(new Date(shift.startTime), new Date(shift.endTime))}
                      </span>
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">{presentCount}</span>
                          <span className="text-lg text-gray-500 dark:text-gray-400">/ {totalUsers}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Present</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${attendanceRate}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-2 rounded-full ${
                                attendanceRate >= 90
                                  ? "bg-emerald-500"
                                  : attendanceRate >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {Math.round(attendanceRate)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isAllPresent && (
                      <div className="grid grid-cols-3 gap-2">
                        {["ABSENT", "LATE", "PERMISSION"].map((status) => {
                          const count = statusCounts[status]
                          if (count === 0) return null
                          const config = statusConfig[status]
                          const Icon = config.icon

                          return (
                            <div
                              key={status}
                              className={`flex items-center gap-2 p-2 rounded-lg ${config.bg} ${config.border}`}
                            >
                              <Icon className={`w-4 h-4 ${config.text}`} />
                              <div className="flex flex-col">
                                <span className={`text-xs font-medium ${config.text}`}>{status.toLowerCase()}</span>
                                <span className={`text-sm font-bold ${config.text}`}>{count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedShift && (
          <Dialog open={!!selectedShift} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader className="pb-6">
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium ${shiftStyles[selectedShift.type] || shiftStyles.morning}`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {capitalize(selectedShift.type)} Shift
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">Attendance Details</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {["ABSENT", "LATE", "PERMISSION"].map((status) => {
                  const users = selectedShift.users?.filter((u) => u.attendanceStatus === status) || []
                  if (!users.length) return null

                  const config = statusConfig[status]
                  const Icon = config.icon

                  return (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bg} ${config.border}`}
                        >
                          <Icon className={`w-4 h-4 ${config.text}`} />
                        </div>
                        <h3 className={`font-semibold text-lg ${config.text}`}>
                          {capitalize(status.toLowerCase())} ({users.length})
                        </h3>
                      </div>
                      <div className="grid gap-2">
                        {users.map((user) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`${config.bg} ${config.border} ${config.text} border-0`}
                            >
                              {status.toLowerCase()}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <DialogFooter className="pt-6">
                <Button onClick={handleClose} className="px-6">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
