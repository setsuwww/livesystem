"use client";

import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react";
import Link from "next/link";

export const Pagination = React.memo(function ({
  page,
  totalPages,
  basePath = "/"
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 mt-4">
      {page > 1 && (
        <Link href={`${basePath}?page=${page - 1}`} className="p-2 rounded-xl text-sm font-medium text-sky-600 border border-slate-100 bg-white shadow-sm hover:bg-slate-50">
          <ChevronLeft size={20} />
        </Link>
      )}
      {page < totalPages && (
        <Link href={`${basePath}?page=${page + 1}`} className="p-2 rounded-xl text-sm font-medium text-sky-600 border border-slate-100 bg-white shadow-sm hover:bg-slate-50">
          <ChevronRight size={20}/>
        </Link>
      )}
    </div>
  );
})
