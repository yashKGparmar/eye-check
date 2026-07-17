import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"

export default function DoubleVisionStep() {
  const { nextStep, updateQuestionnaire } = useVisionTest();

  const handleSelect = (val: boolean) => {
    updateQuestionnaire({ doubleVision: val });
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Double Vision Screening</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Do you ever see two of the same object, either side-by-side or overlapping?
      </P>
      
      <div className="flex gap-4 mb-8 text-6xl">
        <span>A</span>
        <span className="opacity-50 -ml-8 blur-sm">A</span>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => handleSelect(true)}>Yes, frequently</Button>
        <Button onClick={() => handleSelect(false)} variant="secondary">No, rarely or never</Button>
      </div>
    </div>
  );
}
