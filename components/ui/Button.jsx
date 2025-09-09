import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva([
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-100 ease-in",
  "disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus:ring-2",
  ].join(" "),
  {
    variants: { variant: {
        default: "bg-gradient-to-b from-zinc-800 to-zinc-600 inset-shadow-xs inset-shadow-zinc-400 text-white shadow-xs hover:from-zinc-900 hover:to-zinc-700 hover:inset-shadow-zinc-600 focus:ring-zinc-400",
        destructive:"bg-red-500 text-white shadow-xs hover:bg-red-700 focus:ring-red-300",
        positive:"bg-green-500 text-white shadow-xs hover:bg-green-700 focus:ring-green-400",
        outline:"border border-zinc-300 text-zinc-600 bg-zinc-50 shadow-xs hover:bg-zinc-100 hover:text-zinc-900 hover:inset-shadow-xs hover:border-zinc-400 focus:ring-zinc-200",
        primary: "bg-sky-500 border border-sky-500 text-white hover:bg-sky-600 hover:border-sky-700",
        secondary:"font-medium text-sky-600 border border-zinc-300 bg-[#ffffff46] rounded-md shadow-xs hover:bg-zinc-50 hover:border-sky-200",
        ghost:"bg-zinc-100 text-zinc-600 hover:bg-zinc-100",
        link: "text-primary underline-offset-4 hover:underline",
      }, 
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-8 text-sky-700 hover:text-sky-900",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
