import React from "react";

interface ContentInformationProps {
  heading?: string; subheading?: string;
  divider?: {
    color?: string;       // contoh: "border-gray-300"
    thickness?: string;   // contoh: "border-b-2"
  };
}

export default function ContentInformation({ heading, subheading }: ContentInformationProps) {
  const hasHeader = heading || subheading;

  if (!hasHeader) return null;

  return (
    <header className={`mb-2`}>
      {heading && <h2 className="text-lg font-bold text-gray-700">{heading}</h2>}
      {subheading && <p className="text-xs text-gray-500 pb-2">{subheading}</p>}
    </header>
  );
}
