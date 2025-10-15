'use client'

import { useEffect, useState } from "react"
import { Hourglass } from "lucide-react"

export default function GlobalLoading() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + "." : ""))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-slate-100/50 to-white/50 text-slate-700">
      <div className="flex flex-col items-center space-y-4 animate-fadeIn">
        <div className="relative border border-sky-300 p-4 rounded-full">
          <Hourglass className="w-12 h-12 text-sky-600 animate-spin" strokeWidth={1.5} />
          <div className="absolute inset-0 blur-sm bg-sky-400/20 rounded-full animate-pulse" />
        </div>
        <div className="text-xl font-semibold animate-pulse">
          Server Side Rendering
        </div>
        <p className="text-sm text-slate-500 tracking-wide">Render element and Fetching data is on process</p>
      </div>
    </div>
  )
}
