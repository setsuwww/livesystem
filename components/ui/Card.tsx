import React from "react"
import clsx from "clsx"

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={clsx("rounded-2xl border border-gray-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={clsx("p-4 border-b border-gray-200", className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <h3 className={clsx("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <p className={clsx("text-sm text-gray-500", className)}>
      {children}
    </p>
  )
}


export function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={clsx("p-4", className)}>
      {children}
    </div>
  )
}
