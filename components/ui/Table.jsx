"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Table({
  className,
  ...props
}) {
  return (
    <div
      data-slot="table-container"
      className="bg-white relative w-full overflow-x-auto border-y border-neutral-200"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm text-neutral-700", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({
  className,
  ...props
}) {
  return (
    <thead data-slot="table-header" className={cn(
        "[&_tr]:border-b border-neutral-100 bg-neutral-50",
        className
      )}
      {...props}
    />
  )
}

function TableBody({
  className,
  ...props
}) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0 border-neutral-200", className)}
      {...props}
    />
  )
}

function TableFooter({
  className,
  ...props
}) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-neutral-50 border-t border-neutral-200 font-medium [&>tr]:last:border-b-0 text-neutral-600",
        className
      )}
      {...props}
    />
  )
}

function TableRow({
  className,
  ...props
}) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "data-[state=selected]:bg-neutral-100 border-b border-neutral-200 transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({
  className,
  ...props
}) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-3 text-left align-middle whitespace-nowrap tracking-wide text-neutral-600 text-sm uppercase font-semibold",
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  ...props
}) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-3 align-middle whitespace-nowrap text-sm text-neutral-700",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-neutral-400 mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
