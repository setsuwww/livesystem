"use client";;
import * as React from "react";
import { cn } from "@/lib/utils";

export function RadioButton({
  options,
  value,
  onChange,
  name
}) {
  return (
    <div className="flex space-x-4">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label key={option.value} className={cn("cursor-pointer rounded-md border px-3 py-2 text-sm font-medium flex flex-col", "duration-300 ease-in-out active:scale-95",
            selected ? "border-neutral-400 bg-neutral-50 text-neutral-700"
              : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
          )}>
            <div className="flex items-center space-x-2">
              <input type="radio" name={name} value={option.value} checked={selected} onChange={() => onChange(option.value)} className="sr-only"/>
              <span className={cn("w-5 h-5 flex items-center justify-center rounded-full border", selected ? "border-neutral-700" : "border-neutral-400")}>
                {selected && <span className="w-3 h-3 rounded-full bg-neutral-700"></span>}
              </span>

              <span>{option.label}</span>
            </div>

            {option.description && (
              <span className="ml-[28px] mt-0.5 text-xs text-neutral-500">
                {option.description}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
