import React from "react";

interface ContentInformationProps {
  heading?: string;
  subheading?: string;
  icon?: React.ReactNode;
}

export const ContentInformation = React.memo(function ContentInformation({
  heading,
  subheading,
  icon,
}: ContentInformationProps) {
  const hasHeader = heading || subheading || icon;

  if (!hasHeader) return null;

  return (
    <header className="flex items-center gap-3 mb-4">
      {icon && (
        <div className="p-2 bg-sky-100 rounded-xl flex items-center justify-center">
          <span className="text-sky-600">{icon}</span>
        </div>
      )}
      <div className="flex flex-col">
        {heading && (
          <h2 className="text-lg font-bold text-zinc-700">{heading}</h2>
        )}
        {subheading && (
          <p className="text-xs text-zinc-500">{subheading}</p>
        )}
      </div>
    </header>
  );
});
