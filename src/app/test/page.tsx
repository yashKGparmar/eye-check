"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useVisionTest } from "@/store/useVisionTest"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { useRouter } from "next/navigation"

import DistanceVisionStep from "./steps/DistanceVisionStep"
import NearVisionStep from "./steps/NearVisionStep"
import AstigmatismStep from "./steps/AstigmatismStep"
import ColorVisionStep from "./steps/ColorVisionStep"
import QuestionnaireStep from "./steps/QuestionnaireStep"
import AnalyzingStep from "./steps/AnalyzingStep"

export default function TestFlow() {
  const { currentStepIndex } = useVisionTest()
  const router = useRouter()

  const steps = React.useMemo(() => [
    { id: "distance", component: DistanceVisionStep, estimatedTime: "1 min" },
    { id: "near", component: NearVisionStep, estimatedTime: "30 sec" },
    { id: "astigmatism", component: AstigmatismStep, estimatedTime: "30 sec" },
    { id: "color", component: ColorVisionStep, estimatedTime: "30 sec" },
    { id: "questionnaire", component: QuestionnaireStep, estimatedTime: "20 sec" },
    { id: "analyzing", component: AnalyzingStep, estimatedTime: "0 sec" },
  ], [])

  const clampedStepIndex = Math.min(currentStepIndex, steps.length - 1)
  const progress = (clampedStepIndex / Math.max(steps.length - 1, 1)) * 100
  const currentStep = steps[clampedStepIndex] ?? steps[0]
  const StepComponent = currentStep?.component

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit? Your progress is saved automatically.")) {
      router.push("/")
    }
  }

  if (!StepComponent) return null

  return (
    <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 md:p-8 h-full">
      <header className="mb-8 z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">VisionCheck</span>
          {currentStep.id !== "analyzing" && (
            <span className="text-sm text-[var(--text-secondary)]">Progress</span>
          )}
        </div>
        <button
          onClick={handleExit}
          className="rounded-full border border-[var(--input-border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--input-bg)] transition-colors"
          aria-label="Exit Test"
        >
          Done
        </button>
      </header>

      {currentStep.id !== "analyzing" && (
        <div className="mb-6">
          <ProgressBar value={progress} estimatedTime={currentStep.estimatedTime} />
        </div>
      )}

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col h-full absolute inset-0"
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
