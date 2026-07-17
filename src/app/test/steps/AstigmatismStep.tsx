"use client"

import * as React from "react"
import { useVisionTest } from "@/store/useVisionTest"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"

export default function AstigmatismStep() {
  const { nextStep, updateScore } = useVisionTest()
  const [showIntro, setShowIntro] = React.useState(true)

  const handleAnswer = (hasAstigmatism: boolean) => {
    updateScore("astigmatism", hasAstigmatism)
    nextStep()
  }

  if (showIntro) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <H2 className="mb-4">Light and shadow check</H2>
        <P className="mb-8 max-w-md text-lg text-[var(--text-secondary)]">
          Look at the circle and notice whether the lines appear evenly shaded.
        </P>
        <Button size="lg" onClick={() => setShowIntro(false)}>Start</Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-6">
      <H2 className="mb-4 text-center">Light and shadow check</H2>
      <P className="mb-8 max-w-md text-center text-[var(--text-secondary)]">
        Do any lines look a little darker or sharper than the others?
      </P>
      
      {/* Clock Dial SVG */}
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center bg-white rounded-full p-4 shadow-sm border border-gray-200">
        <svg viewBox="0 0 100 100" className="w-full h-full text-black">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="2" fill="currentColor" />
          
          {/* Draw 12 lines for the clock dial */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180
            const x1 = 50 + 5 * Math.cos(angle)
            const y1 = 50 + 5 * Math.sin(angle)
            const x2 = 50 + 45 * Math.cos(angle)
            const y2 = 50 + 45 * Math.sin(angle)
            return (
              <line 
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="currentColor" 
                strokeWidth="1.5" 
              />
            )
          })}
        </svg>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button variant="secondary" onClick={() => handleAnswer(true)} className="w-full text-balance h-auto py-3">
          Yes, a little
        </Button>
        <Button onClick={() => handleAnswer(false)} className="w-full text-balance h-auto py-3">
          No, they look the same
        </Button>
      </div>
    </div>
  )
}
