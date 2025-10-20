"use client";;
import * as React from "react";
import { cn } from "@/_lib/utils";

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
            selected ? "border-slate-400 bg-slate-50 text-slate-700"
              : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
          )}>
            <div className="flex items-center space-x-2">
              <input type="radio" name={name} value={option.value} checked={selected} onChange={() => onChange(option.value)} className="sr-only"/>
              <span className={cn("w-5 h-5 flex items-center justify-center rounded-full border", selected ? "border-slate-700" : "border-slate-400")}>
                {selected && <span className="w-3 h-3 rounded-full bg-slate-700"></span>}
              </span>

              <span>{option.label}</span>
            </div>

            {option.description && (
              <span className="ml-[28px] mt-0.5 text-xs text-slate-500">
                {option.description}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
