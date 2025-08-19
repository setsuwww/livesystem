"use client";

import React from "react";
import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath?: string;
}

export const Pagination = React.memo(function ({ page, totalPages, basePath = "/schedules" }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 mt-4">
      {page > 1 && (
        <Link href={`${basePath}?page=${page - 1}`} className="px-4 py-1.5 text-sm font-medium text-sky-600 border border-gray-300 bg-[#ffffff46] rounded-md shadow-sm hover:bg-gray-50">
          Prev Page
        </Link>
      )}
      {page < totalPages && (
        <Link href={`${basePath}?page=${page + 1}`} className="px-4 py-1.5 text-sm font-medium text-sky-600 border border-gray-300 bg-[#ffffff46] rounded-md shadow-sm hover:bg-gray-50">
          Next Page
        </Link>
      )}
    </div>
  );
})
