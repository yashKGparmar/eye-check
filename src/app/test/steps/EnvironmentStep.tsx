"use client"

import * as React from "react"
import { useVisionTest, type EnvironmentData } from "@/store/useVisionTest"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export default function EnvironmentStep() {
  const { nextStep, updateEnvironment, environment } = useVisionTest()
  const [localEnv, setLocalEnv] = React.useState<EnvironmentData>(environment)

  const handleNext = () => {
    updateEnvironment(localEnv)
    nextStep()
  }

  // A quick helper to check if they've answered the essential parts to proceed
  const isValid = 
    localEnv.lighting !== null && 
    localEnv.distance !== '' &&
    localEnv.wearingGlasses !== null

  return (
    <div className="flex-1 flex flex-col items-center text-center justify-center max-w-xl mx-auto w-full pb-10">
      <H2 className="mb-2">Environment Check</H2>
      <P className="mb-8 text-[var(--text-secondary)]">
        Your environment affects your vision. Let&apos;s make sure we have the right context.
      </P>

      <div className="space-y-8 w-full text-left">
        
        {/* Lighting */}
        <div>
          <label className="block text-sm font-semibold mb-3">How is the lighting in your room?</label>
          <div className="grid grid-cols-3 gap-3">
            {(['good', 'fair', 'poor'] as const).map(option => (
              <button
                key={option}
                onClick={() => setLocalEnv(p => ({ ...p, lighting: option }))}
                className={cn(
                  "p-3 rounded-xl border capitalize transition-colors font-medium text-sm",
                  localEnv.lighting === option 
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
                    : "border-[var(--card-border)] hover:bg-[var(--input-bg)] bg-[var(--card-bg)]"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-semibold mb-3">How far are you from the screen?</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Arm\'s length (Desktop/Laptop)', value: '60cm' },
              { label: 'Close (Phone/Tablet)', value: '30cm' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setLocalEnv(p => ({ ...p, distance: option.value }))}
                className={cn(
                  "p-3 rounded-xl border transition-colors font-medium text-sm text-center text-balance",
                  localEnv.distance === option.value 
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
                    : "border-[var(--card-border)] hover:bg-[var(--input-bg)] bg-[var(--card-bg)]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Glasses */}
        <div>
          <label className="block text-sm font-semibold mb-3">Are you currently wearing glasses or contacts?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLocalEnv(p => ({ ...p, wearingGlasses: true }))}
              className={cn(
                "p-3 rounded-xl border transition-colors font-medium text-sm text-center",
                localEnv.wearingGlasses === true 
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
                  : "border-[var(--card-border)] hover:bg-[var(--input-bg)] bg-[var(--card-bg)]"
              )}
            >
              Yes
            </button>
            <button
              onClick={() => setLocalEnv(p => ({ ...p, wearingGlasses: false }))}
              className={cn(
                "p-3 rounded-xl border transition-colors font-medium text-sm text-center",
                localEnv.wearingGlasses === false 
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
                  : "border-[var(--card-border)] hover:bg-[var(--input-bg)] bg-[var(--card-bg)]"
              )}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full">
        <Button onClick={handleNext} disabled={!isValid} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  )
}
