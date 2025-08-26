import React from "react";

export const ContentInformation = React.memo(function ContentInformation({
  heading,
  subheading,
  icon
}) {
  const hasHeader = heading || subheading || icon;

  if (!hasHeader) return null;

  return (
    <header className="flex items-center gap-2 mb-3">
      {icon && (
        <div className="p-2 bg-sky-100 rounded-xl flex items-center justify-center">
          <span className="text-sky-600">{icon}</span>
        </div>
      )}
      <div className="flex flex-col">
        {heading && (
          <h2 className="text-xl font-bold text-head">{heading}</h2>
        )}
        {subheading && (
          <p className="text-sm text-subhead">{subheading}</p>
        )}
      </div>
    </header>
  );
});
