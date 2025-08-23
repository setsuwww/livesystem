'use client';
import React, { useState, useRef, useEffect } from "react"

export function Dropdown({
  label,
  items
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer select-none flex items-center gap-2">
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <ul className="absolute mt-2 w-40 p-2 bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
          {items.map((item, i) => (
            <li key={i} onClick={() => { item.onClick(), setOpen(false)}} className="px-4 py-2 hover:bg-zinc-100 hover:rounded-lg cursor-pointer">
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
