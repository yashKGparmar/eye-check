"use client"

import * as React from "react"
import { useVisionTest } from "@/store/useVisionTest"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"

const CHARACTERS = "CDEFHKNPRSUVZ"

function getRandomChar() {
  return CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
}

export default function ContrastStep() {
  const { nextStep, updateScore } = useVisionTest()
  
  // Opacity levels: 0.15 is very hard, 0.4 is medium, 0.7 is easy
  const levels = React.useMemo(() => [
    { opacity: 0.6, score: 100 },
    { opacity: 0.3, score: 50 },
    { opacity: 0.15, score: 20 },
    { opacity: 0.05, score: 10 },
  ], [])

  const [currentLevelIdx, setCurrentLevelIdx] = React.useState(0)
  const [displayedChar, setDisplayedChar] = React.useState(getRandomChar())
  const [scoreAcc, setScoreAcc] = React.useState(200)

  const handleAnswer = (canSee: boolean) => {
    if (canSee) {
      setScoreAcc(levels[currentLevelIdx].score)
      if (currentLevelIdx < levels.length - 1) {
        setCurrentLevelIdx(p => p + 1)
        setDisplayedChar(getRandomChar())
      } else {
        finish(levels[currentLevelIdx].score)
      }
    } else {
      finish(scoreAcc)
    }
  }

  const finish = (finalScore: number) => {
    updateScore("contrast", finalScore)
    nextStep()
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <H2 className="mb-4">Contrast Sensitivity</H2>
      <P className="mb-8 max-w-md text-center text-[var(--text-secondary)]">
        Indicate if you can read the faint letter in the box below. Ensure your screen brightness is turned up.
      </P>

      <div className="flex-1 flex items-center justify-center w-full min-h-[250px]">
        <div className="w-64 h-64 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayedChar + currentLevelIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-8xl font-bold"
              style={{ color: `rgba(0, 0, 0, ${levels[currentLevelIdx].opacity})` }}
            >
              {displayedChar}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full max-w-sm mt-12 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={() => handleAnswer(false)}>I can&apos;t see it</Button>
          <Button onClick={() => handleAnswer(true)}>I can read it</Button>
        </div>
      </div>
    </div>
  )
}
