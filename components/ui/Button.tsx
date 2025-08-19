import React from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "custom";
type Size = "icon" | "sm" | "md" | "lg";

interface ButtonProps {
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = "primary", size = "md", disabled = false, loading = false, className = "", type = "submit" }) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap gap-1 rounded-md font-medium transition-all ease-in-out duration-150 active:scale-95 border";

  const variantStyles: Record<Exclude<Variant, "custom">, string> = {
    primary: "bg-sky-500 border-sky-500 text-white hover:bg-sky-400",
    secondary: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
    outline: "bg-transparent border-gray-300 text-gray-800 hover:bg-gray-100",
    ghost: "bg-transparent border-transparent text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-500 border-red-500 text-white hover:bg-red-400",
  };

  const sizeStyles: Record<Size, string> = {
    icon: "p-1.5 w-7 h-7",
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  };

  const finalClassName =
    variant === "custom" ? `${baseStyles} ${sizeStyles[size]} ${className} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}`
      : `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={finalClassName}>
      {loading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
};
