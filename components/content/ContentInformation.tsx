import React from "react";

interface ContentInformationProps {
  heading?: string;
  subheading?: string;
}

export const ContentInformation = React.memo(function ContentInformation({ heading, subheading }: ContentInformationProps) {
  const hasHeader = heading || subheading;

  if (!hasHeader) return null;

  return (
    <header className=" mb-2">
      {heading && <h2 className="text-lg font-bold text-zinc-700">{heading}</h2>}
      {subheading && <p className="text-xs text-zinc-500 pb-2">{subheading}</p>}
    </header>
  );
});
