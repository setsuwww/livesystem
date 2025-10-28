import * as React from "react"
import { cn } from "@/_lib/utils"

function Input({
  className,
  type,
  typeSearch = false,
  ...props
}) {
  const baseClasses =
    "file:text-slate-600 placeholder:text-slate-500 flex h-9 w-full min-w-0 rounded-lg border px-3 py-1 text-base  transition-[color,box-shadow,border] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

  const defaultFocus =
    "border-slate-300 focus-visible:border-sky-300 focus-visible:ring-sky-100 bg-white focus-visible:ring-[3px] shadow-xs"
  const searchFocus =
    "border-slate-100 focus-visible:border-slate-200 bg-slate-100 focus-visible:ring-slate-100"

  return (
    <input
      type={type}
      data-slot="input"
      suppressHydrationWarning
      className={cn(
        baseClasses,
        typeSearch ? searchFocus : defaultFocus,
        "aria-invalid:border-rose-300 aria-invalid:ring-rose-100",
        className
      )}
      {...props}
    />
  )
}

export { Input }
