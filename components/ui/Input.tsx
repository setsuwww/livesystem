import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelColor?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, labelColor = 'text-gray-800', error, className, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className={`block text-sm font-medium ${labelColor} mb-1`}>{label}</label>}

        <input type={type} className={cn(
            "w-full px-3 py-2 text-sm border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200",
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300", props.disabled && "bg-gray-100 cursor-not-allowed text-gray-500",
            className
          )} ref={ref} {...props}
        />
        {error && (
          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V5z" clipRule="evenodd"/>
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
