"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { H2, P } from "@/components/ui/Typography"
import { Loader2 } from "lucide-react"

export default function AnalyzingStep() {
  const router = useRouter()

  React.useEffect(() => {
    // Simulate AI processing time to give a premium feel
    const timer = setTimeout(() => {
      router.push("/results")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative w-24 h-24 mb-8">
          {/* Pulsing background rings */}
          <motion.div 
            className="absolute inset-0 border-[3px] border-[var(--color-primary)] rounded-full opacity-20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-2 border-[3px] border-[var(--color-primary)] rounded-full opacity-40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--card-bg)] rounded-full z-10 shadow-sm border border-[var(--card-border)]">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          </div>
        </div>

        <H2 className="mb-3 text-2xl sm:text-3xl">Looking over your results</H2>
        <P className="text-lg text-[var(--text-secondary)]">
          Just a moment.
        </P>
      </motion.div>
    </div>
  )
}
