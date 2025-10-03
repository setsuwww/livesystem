import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva([
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-100 ease-in",
  "disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus:ring-2",
  ].join(" "),
  {
    variants: { variant: {
        default: "bg-gradient-to-b from-neutral-800 to-neutral-600 text-white shadow-xs hover:from-neutral-900 hover:to-neutral-700 hover:inset-shadow-neutral-600 focus:ring-neutral-400",
        destructive:"bg-rose-500 text-white shadow-xs hover:bg-rose-700 focus:ring-rose-300",
        positive:"bg-teal-500 text-white shadow-xs hover:bg-teal-700 focus:ring-teal-400",
        outline:"border border-neutral-300 font-semibold text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-200",
        primary: "bg-sky-600 border border-sky-600 text-white hover:bg-sky-700 hover:border-sky-700",
        secondary:"font-medium text-sky-600 border border-neutral-300 bg-[#ffffff46] rounded-md shadow-xs hover:bg-neutral-50 hover:border-sky-200",
        ghost:"bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
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
