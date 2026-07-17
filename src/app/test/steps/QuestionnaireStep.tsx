"use client"

import * as React from "react"
import { useVisionTest } from "@/store/useVisionTest"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const symptoms = [
  { id: "blurVision", label: "Blurred vision" },
  { id: "headache", label: "Frequent headaches" },
  { id: "doubleVision", label: "Double vision" },
  { id: "squinting", label: "Squinting to see clearly" },
] as const

type SymptomKey = (typeof symptoms)[number]["id"]

function SymptomOption({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
        checked
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--foreground)]"
          : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)]"
      )}
    >
      {label}
    </button>
  )
}

export default function QuestionnaireStep() {
  const { nextStep, updateQuestionnaire, questionnaire } = useVisionTest()

  const [selectedSymptoms, setSelectedSymptoms] = React.useState<Record<SymptomKey, boolean>>({
    blurVision: questionnaire.blurVision,
    headache: questionnaire.headache,
    doubleVision: questionnaire.doubleVision,
    squinting: questionnaire.squinting,
  })

  const toggleSymptom = (id: SymptomKey) => {
    setSelectedSymptoms((previous) => ({ ...previous, [id]: !previous[id] }))
  }

  const handleContinue = () => {
    updateQuestionnaire(selectedSymptoms)
    nextStep()
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-xl">
        <H2 className="mb-2">A quick symptom check</H2>
        <P className="mb-8 text-[var(--text-secondary)]">
          Pick any symptoms you notice today. You can leave everything unchecked if you do not notice any.
        </P>

        <div className="grid gap-3 text-left">
          {symptoms.map(({ id, label }) => (
            <SymptomOption
              key={id}
              label={label}
              checked={selectedSymptoms[id]}
              onToggle={() => toggleSymptom(id)}
            />
          ))}
        </div>

        <Button onClick={handleContinue} size="lg" className="mt-8">
          See your summary
        </Button>
      </div>
    </div>
  )
}
