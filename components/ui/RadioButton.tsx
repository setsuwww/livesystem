"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  label: string;
  value: string;
  description?: string; 
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
          <label key={option.value} className={cn("cursor-pointer rounded-md border px-3 py-2 text-sm font-medium flex flex-col", "duration-300 ease-in-out active:scale-95",
            selected ? "border-zinc-400 bg-zinc-50 text-zinc-700"
              : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50"
          )}>
            <div className="flex items-center space-x-2">
              <input type="radio" name={name} value={option.value} checked={selected} onChange={() => onChange(option.value)} className="sr-only"/>
              <span className={cn("w-5 h-5 flex items-center justify-center rounded-full border", selected ? "border-zinc-700" : "border-zinc-400")}>
                {selected && <span className="w-3 h-3 rounded-full bg-zinc-700"></span>}
              </span>

              <span>{option.label}</span>
            </div>

            {option.description && (
              <span className="ml-[28px] mt-0.5 text-xs text-zinc-500">
                {option.description}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
