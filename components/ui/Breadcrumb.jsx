"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Breadcrumb({
  items
}) {
  const pathname = usePathname();

  const segments = pathname?.split("/").filter(Boolean) || [];

  const autoItems = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    return {
      label: capitalize(seg.replace(/-/g, " ")),
      href,
    };
  });

  const breadcrumbItems = items ?? autoItems;

  return (
    <nav className="text-sm text-neutral-500" aria-label="Breadcrumb">
      <ol className="flex space-x-2">
        {breadcrumbItems.map((item, idx) => {
          const isLast = idx === breadcrumbItems.length - 1;
          return (
            <li key={idx} className="flex items-center">
              {!isLast && item.href ? (
                <>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                  <span className="mx-1 select-none">/</span>
                </>
              ) : (
                <span className="text-neutral-700 font-semibold">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
