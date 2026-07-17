"use client"

import * as React from "react"
import { useVisionTest } from "@/store/useVisionTest"
import { useAppConfig } from "@/store/useAppConfig"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"

type Phase = "intro" | "left" | "right" | "both" | "transition" | "done"

const STANDARD_CHARS = "CDEFHKNPRSUVZ123456789"
const CHILD_SHAPES = ["⭐", "🍎", "🚗", "🐶", "🔵", "🐱", "🐰", "☀️"]

function getRandomChar(isChildMode: boolean) {
  if (isChildMode) {
    return CHILD_SHAPES[Math.floor(Math.random() * CHILD_SHAPES.length)]
  }
  return STANDARD_CHARS.charAt(Math.floor(Math.random() * STANDARD_CHARS.length))
}

export default function DistanceVisionStep() {
  const { nextStep, updateScore } = useVisionTest()
  const { testMode } = useAppConfig()
  const isChildMode = testMode === 'child'
  
  const [phase, setPhase] = React.useState<Phase>("intro")
  
  const levels = React.useMemo(() => [
    { acuity: 200, sizeMm: 8.7 },
    { acuity: 100, sizeMm: 4.35 },
    { acuity: 50, sizeMm: 2.18 },
    { acuity: 40, sizeMm: 1.74 },
    { acuity: 30, sizeMm: 1.31 },
    { acuity: 20, sizeMm: 0.87 },
  ], [])

  const [currentLevelIdx, setCurrentLevelIdx] = React.useState(0)
  const [displayedChar, setDisplayedChar] = React.useState(() => getRandomChar(isChildMode))
  const [scoreAcc, setScoreAcc] = React.useState(200)

  const startPhase = React.useCallback((p: Phase) => {
    setPhase(p)
    setCurrentLevelIdx(0)
    setScoreAcc(200)
    setDisplayedChar(getRandomChar(isChildMode))
  }, [isChildMode])

  const startLeftTest = () => startPhase("left")
  const startRightTest = () => startPhase("right")

  const handleAnswer = (canSee: boolean) => {
    if (canSee) {
      setScoreAcc(levels[currentLevelIdx].acuity)
      
      if (currentLevelIdx < levels.length - 1) {
        setCurrentLevelIdx(p => p + 1)
        setDisplayedChar(getRandomChar(isChildMode))
      } else {
        finishPhase(levels[currentLevelIdx].acuity)
      }
    } else {
      finishPhase(scoreAcc)
    }
  }

  const finishPhase = (finalScore: number) => {
    if (phase === "left") {
      updateScore("distanceLeft", finalScore)
      setPhase("transition")
    } else if (phase === "right") {
      updateScore("distanceRight", finalScore)
      startPhase("both")
    } else if (phase === "both") {
      updateScore("distanceBoth", finalScore)
      setPhase("done")
    }
  }

  if (phase === "intro") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <H2 className="mb-4">Distance vision check</H2>
        <P className="mb-8 max-w-md text-lg text-[var(--text-secondary)]">
          Cover your right eye. Keep your left eye open and try to read the letter or symbol. If you cannot see it clearly, choose “Not clearly”.
        </P>
        <Button size="lg" onClick={startLeftTest}>Start</Button>
      </div>
    )
  }

  if (phase === "transition") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <H2 className="mb-4">Next step</H2>
        <P className="mb-8 max-w-md text-lg text-[var(--text-secondary)]">
          Cover your left eye. Keep your right eye open and do the same.
        </P>
        <Button size="lg" onClick={startRightTest}>Start</Button>
      </div>
    )
  }

  if (phase === "done") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <H2 className="mb-4">Distance vision complete</H2>
        <Button onClick={nextStep} className="mt-8">Continue</Button>
      </div>
    )
  }

  const currentSizePx = levels[currentLevelIdx].sizeMm * 24 * (isChildMode ? 1.4 : 1)

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <div className="absolute top-0 text-center w-full">
        <div className="inline-block bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-sm font-medium mb-2">
          {phase === "left" && "Cover your RIGHT eye"}
          {phase === "right" && "Cover your LEFT eye"}
          {phase === "both" && "Keep BOTH eyes open"}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={displayedChar + currentLevelIdx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
          style={{ height: '300px' }}
        >
          <span 
            className={`font-bold ${!isChildMode ? "text-[var(--foreground)]" : ""}`}
            style={{ fontSize: `${currentSizePx}px`, lineHeight: 1 }}
          >
            {displayedChar}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-sm mt-12 space-y-4">
        <P className="text-center font-medium mb-4">Can you read it clearly?</P>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={() => handleAnswer(false)}>Not clearly</Button>
          <Button onClick={() => handleAnswer(true)}>Yes</Button>
        </div>
      </div>
    </div>
  )
}
