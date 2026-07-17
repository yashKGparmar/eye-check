"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 to 100
  estimatedTime?: string
}

export function ProgressBar({ value, estimatedTime, className, ...props }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex justify-between items-center mb-2 text-sm text-[var(--text-secondary)] font-medium">
        <span>Progress {Math.round(clampedValue)}%</span>
        {estimatedTime && <span>~{estimatedTime} remaining</span>}
      </div>
      <div
        className="h-2 w-full bg-[var(--input-bg)] rounded-full overflow-hidden border border-[var(--input-border)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clampedValue)}
        aria-label="Test progress"
      >
        <motion.div
          className="h-full bg-[var(--color-primary)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}
