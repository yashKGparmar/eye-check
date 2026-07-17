import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    
    const baseStyles = "inline-flex min-h-[52px] w-full items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-[var(--background)] sm:w-auto"
    
    const variants = {
      default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm",
      secondary: "bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--input-border)] hover:bg-[var(--card-border)]",
      outline: "border border-[var(--input-border)] bg-transparent hover:bg-[var(--input-bg)] text-[var(--foreground)]",
      ghost: "hover:bg-[var(--input-bg)] text-[var(--foreground)]",
      link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
      danger: "bg-[var(--color-danger)] text-white hover:bg-red-600",
    }
    
    const sizes = {
      default: "h-[52px] px-8 py-3",
      sm: "h-10 rounded-lg px-4 text-sm",
      lg: "h-14 rounded-2xl px-10 text-lg",
      icon: "h-[52px] w-[52px]",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
