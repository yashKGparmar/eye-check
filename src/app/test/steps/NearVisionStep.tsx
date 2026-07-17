"use client"

import * as React from "react"
import { useVisionTest } from "@/store/useVisionTest"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog. A journey of a thousand miles begins with a single step.",
  "Vision screening helps identify potential issues early. Regular checkups are important for maintaining good eye health and clear vision.",
  "Astigmatism is a common condition that causes blurred vision. It occurs when the cornea is irregularly shaped.",
  "Reading small text can cause eye strain. Remember to take frequent breaks using the 20-20-20 rule to rest your eyes.",
]

export default function NearVisionStep() {
  const { nextStep, updateScore } = useVisionTest()
  
  const levels = React.useMemo(() => [
    { sizeMm: 3.0, score: 200 },
    { sizeMm: 2.0, score: 100 },
    { sizeMm: 1.5, score: 50 },
    { sizeMm: 1.0, score: 20 },
  ], [])

  const [showIntro, setShowIntro] = React.useState(true)
  const [currentLevelIdx, setCurrentLevelIdx] = React.useState(0)
  const [scoreAcc, setScoreAcc] = React.useState(200)

  const startTest = () => {
    setShowIntro(false)
    setCurrentLevelIdx(0)
    setScoreAcc(200)
  }

  const handleAnswer = (canRead: boolean) => {
    if (canRead) {
      setScoreAcc(levels[currentLevelIdx].score)
      if (currentLevelIdx < levels.length - 1) {
        setCurrentLevelIdx(p => p + 1)
      } else {
        finish(levels[currentLevelIdx].score)
      }
    } else {
      finish(scoreAcc)
    }
  }

  const finish = (finalScore: number) => {
    updateScore("near", finalScore)
    nextStep()
  }

  const currentSizePx = levels[currentLevelIdx].sizeMm * 28

  if (showIntro) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <H2 className="mb-4">Reading vision</H2>
        <P className="mb-8 max-w-md text-lg text-[var(--text-secondary)]">
          Hold your phone at your usual reading distance.
        </P>
        <Button size="lg" onClick={startTest}>Start</Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <H2 className="mb-8">Reading vision</H2>
      
      <div className="flex-1 flex items-center justify-center w-full px-4 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevelIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-md text-center"
          >
            <p 
              className="text-[var(--foreground)] font-serif leading-relaxed"
              style={{ fontSize: `${currentSizePx}px` }}
            >
              {PARAGRAPHS[currentLevelIdx]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm mt-12 space-y-4">
        <P className="text-center font-medium mb-4">Can you read it?</P>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={() => handleAnswer(false)}>Not clearly</Button>
          <Button onClick={() => handleAnswer(true)}>Yes</Button>
        </div>
      </div>
    </div>
  )
}
