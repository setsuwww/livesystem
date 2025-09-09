import React from "react";

export const ContentInformation = React.memo(function ContentInformation({
  heading,
  subheading,
}) {
  const hasHeader = heading || subheading ;

  if (!hasHeader) return null;

  return (
    <header className="flex items-center gap-2 mb-3">
      <div className="flex flex-col">
        {heading && (
          <h2 className="text-lg font-bold text-head">{heading}</h2>
        )}
        {subheading && (
          <p className="text-sm text-subhead">{subheading}</p>
        )}
      </div>
    </header>
  );
});
