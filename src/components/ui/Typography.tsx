import * as React from "react"
import { cn } from "@/lib/utils"

interface TextProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  as?: React.ElementType
}

export function H1({ className, as: Component = "h1", ...props }: TextProps) {
  return (
    <Component
      className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-[var(--foreground)]", className)}
      {...props}
    />
  )
}

export function H2({ className, as: Component = "h2", ...props }: TextProps) {
  return (
    <Component
      className={cn("scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-[var(--foreground)]", className)}
      {...props}
    />
  )
}

export function H3({ className, as: Component = "h3", ...props }: TextProps) {
  return (
    <Component
      className={cn("scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]", className)}
      {...props}
    />
  )
}

export function P({ className, as: Component = "p", ...props }: TextProps) {
  return (
    <Component
      className={cn("leading-7 text-[var(--foreground)] [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  )
}

export function Lead({ className, as: Component = "p", ...props }: TextProps) {
  return (
    <Component
      className={cn("text-xl text-[var(--text-secondary)]", className)}
      {...props}
    />
  )
}

export function Muted({ className, as: Component = "p", ...props }: TextProps) {
  return (
    <Component
      className={cn("text-sm text-[var(--text-secondary)]", className)}
      {...props}
    />
  )
}
