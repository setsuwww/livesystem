"use client"

import React from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export const ContentInformation = React.memo(function ContentInformation({
  heading,
  subheading,
  show = false,
  buttonText = "Create",
  href,
  variant = "primary",
}) {
  const hasHeader = heading || subheading;
  const router = useRouter();

  if (!hasHeader) return null;

  return (
    <header className="flex items-center justify-between mb-3">
      <div className="flex flex-col">
        {heading && (
          <h2 className="text-lg font-bold text-slate-700/80">{heading}</h2>
        )}
        {subheading && (
          <p className="text-sm text-slate-500">{subheading}</p>
        )}
      </div>

      {show && (
        <Button variant={variant} onClick={() => router.push(href)}>
          {buttonText}
        </Button>
      )}
    </header>
  );
});
