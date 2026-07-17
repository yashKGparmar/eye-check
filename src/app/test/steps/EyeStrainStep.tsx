import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"

export default function EyeStrainStep() {
  const { nextStep, updateQuestionnaire } = useVisionTest();

  const handleSelect = (val: boolean) => {
    updateQuestionnaire({ screenFatigue: val });
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Digital Eye Strain</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Do you experience headaches or blurred vision after prolonged screen use without breaks?
      </P>
      
      <div className="flex gap-4">
        <Button onClick={() => handleSelect(true)}>Yes</Button>
        <Button onClick={() => handleSelect(false)} variant="secondary">No</Button>
      </div>
    </div>
  );
}
