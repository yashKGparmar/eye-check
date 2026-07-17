import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"

export default function DryEyeStep() {
  const { nextStep, updateQuestionnaire } = useVisionTest();

  const handleSelect = (val: boolean) => {
    updateQuestionnaire({ dryEyes: val });
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Dry Eye Assessment</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Do your eyes frequently feel burning, itchy, or overly watery, especially in air conditioning or after screen time?
      </P>
      
      <div className="flex gap-4">
        <Button onClick={() => handleSelect(true)}>Yes, frequently</Button>
        <Button onClick={() => handleSelect(false)} variant="secondary">No, rarely or never</Button>
      </div>
    </div>
  );
}
