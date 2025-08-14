import React from "react"

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger" | "destructive" | "custom"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = "primary", size = "md", disabled = false, loading = false, className = "",}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-1 rounded-md font-medium transition-all duration-150 ease-in-out active:scale-95"

  const variantStyles: Record<string, string> = {
    primary: "bg-sky-500 text-white hover:bg-sky-400",
    destructive: "bg-red-500 text-white hover:bg-red-400",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-transparent text-red-600 border border-red-600 hover:bg-red-50",
  }

  const sizeStyles: Record<string, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  }

  const finalClassName =
    variant === "custom"
      ? className
      : `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
          disabled || loading ? "opacity-50 cursor-not-allowed" : ""
        }`

  return (
    <button onClick={onClick} disabled={disabled || loading} className={finalClassName}>
      {loading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  )
}
