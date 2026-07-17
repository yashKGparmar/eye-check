"use client"

import * as React from "react"
import { useVisionTest } from "@/store/useVisionTest"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"

// Simple pixel-art like matrix for numbers 3, 5, 8
const numberPatterns = {
  3: [
    [1,1,1,1,0],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,0,0,0,1],
    [1,1,1,1,0],
  ],
  5: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,0,1],
    [1,1,1,1,0],
  ],
  8: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ]
}

const plates = [
  { number: 3, bgColors: ['#8db68c', '#a2c89f', '#6c966a'], fgColors: ['#d7856b', '#c2664b', '#e29a82'] },
  { number: 5, bgColors: ['#d7856b', '#c2664b'], fgColors: ['#8db68c', '#a2c89f'] },
  { number: 8, bgColors: ['#8db68c', '#a2c89f', '#d7856b'], fgColors: ['#c2664b', '#e29a82'] } // mixed tricky one
]

function generateDots(number: number, bgColors: string[], fgColors: string[]) {
  const dots = []
  const pattern = numberPatterns[number as keyof typeof numberPatterns]
  
  // We'll create a 12x12 grid of dots
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      // Add some random jitter
      const cx = (c * 20) + 10 + (Math.random() * 8 - 4)
      const cy = (r * 20) + 10 + (Math.random() * 8 - 4)
      const radius = 6 + Math.random() * 4
      
      // Check if this cell falls into the pattern area (center it)
      const pr = r - 3
      const pc = c - 3
      let isFg = false
      if (pr >= 0 && pr < 5 && pc >= 0 && pc < 5) {
        if (pattern[pr][pc] === 1) {
          isFg = true
        }
      }
      
      const colors = isFg ? fgColors : bgColors
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      dots.push({ cx, cy, radius, color, id: `${r}-${c}` })
    }
  }
  return dots
}

export default function ColorVisionStep() {
  const { nextStep, updateScore } = useVisionTest()
  
  const [showIntro, setShowIntro] = React.useState(true)
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [score, setScore] = React.useState(0)
  
  const currentPlate = plates[currentIdx]
  
  const dots = React.useMemo(() => {
    return generateDots(currentPlate.number, currentPlate.bgColors, currentPlate.fgColors)
  }, [currentPlate])

  const handleAnswer = (answer: number | null) => {
    let newScore = score
    if (answer === currentPlate.number) {
      newScore += 1
    }
    
    if (currentIdx < plates.length - 1) {
      setScore(newScore)
      setCurrentIdx(p => p + 1)
    } else {
      updateScore("color", newScore)
      nextStep()
    }
  }

  if (showIntro) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <H2 className="mb-4">Color check</H2>
        <P className="mb-8 max-w-md text-lg text-[var(--text-secondary)]">
          Look at each circle and pick the number you see.
        </P>
        <Button size="lg" onClick={() => setShowIntro(false)}>Start</Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-6">
      <H2 className="mb-4 text-center">Color check</H2>
      <P className="mb-8 max-w-md text-center text-[var(--text-secondary)]">
        What number do you see? If you do not see one, choose &quot;Nothing&quot;.
      </P>
      
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center bg-white rounded-full p-2 shadow-sm border border-gray-200 overflow-hidden">
        <svg viewBox="0 0 240 240" className="w-full h-full rounded-full bg-gray-50">
          <AnimatePresence mode="popLayout">
            <motion.g
              key={currentIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {dots.map(dot => (
                <circle 
                  key={dot.id}
                  cx={dot.cx} 
                  cy={dot.cy} 
                  r={dot.radius} 
                  fill={dot.color} 
                />
              ))}
            </motion.g>
          </AnimatePresence>
        </svg>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={() => handleAnswer(3)}>3</Button>
          <Button variant="secondary" onClick={() => handleAnswer(5)}>5</Button>
          <Button variant="secondary" onClick={() => handleAnswer(8)}>8</Button>
          <Button variant="secondary" onClick={() => handleAnswer(null)}>Nothing</Button>
        </div>
      </div>
    </div>
  )
}
