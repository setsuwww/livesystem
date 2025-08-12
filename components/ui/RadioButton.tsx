"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  label: string;
  value: string;
  description?: string; // optional description
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export function RadioButton({ options, value, onChange, name }: RadioGroupProps) {
  return (
    <div className="flex space-x-4">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label key={option.value} className={cn("cursor-pointer rounded-md border px-3 py-2 text-sm font-medium flex flex-col",
            selected
              ? "border-gray-400 bg-gray-50 text-gray-700"
              : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
          )}>
            <div className="flex items-center space-x-2">
              <input type="radio" name={name} value={option.value} checked={selected}
                onChange={() => onChange(option.value)} className="sr-only"
              />
              <span className={cn("w-5 h-5 flex items-center justify-center rounded-full border", 
                selected ? "border-gray-700" : "border-gray-400"
              )}>
                {selected && (
                  <span className="w-3 h-3 rounded-full bg-gray-700"></span>
                )}
              </span>

              {/* Label text */}
              <span>{option.label}</span>
            </div>

            {/* Optional description */}
            {option.description && (
              <span className="ml-[28px] mt-0.5 text-xs text-gray-500">
                {option.description}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
