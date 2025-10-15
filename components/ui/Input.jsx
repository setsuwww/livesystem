import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input" suppressHydrationWarning
      className={cn(
        "file:text-foreground placeholder:text-slate-400 border-slate-300 flex h-10 w-full min-w-0 rounded-lg border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-sky-300 focus-visible:ring-sky-100 focus-visible:ring-[3px]",
        "aria-invalid:border-rose-300 aria-invalid:ring-rose-100",
        className
      )}
      {...props}
    />
  )
}

export { Input }
