"use client";

import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react";
import Link from "next/link";

export const Pagination = React.memo(function ({
  page,
  totalPages,
  basePath = "/schedules"
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 mt-4">
      {page > 1 && (
        <Link href={`${basePath}?page=${page - 1}`} className="flex items-center space-x-2 px-4 py-1.5 text-sm font-medium text-sky-600 border border-zinc-300 bg-[#ffffff46] rounded-md shadow-sm hover:bg-zinc-50">
          <ChevronLeft size={20} /> <span>Prev Page</span>
        </Link>
      )}
      {page < totalPages && (
        <Link href={`${basePath}?page=${page + 1}`} className="flex items-center space-x-2 px-4 py-1.5 text-sm font-medium text-sky-600 border border-zinc-300 bg-[#ffffff46] rounded-md shadow-sm hover:bg-zinc-50">
          <span>Next Page</span> <ChevronRight size={20}/>
        </Link>
      )}
    </div>
  );
})
