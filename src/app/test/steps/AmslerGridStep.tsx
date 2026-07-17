import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"

export default function AmslerGridStep() {
  const { nextStep, updateScore } = useVisionTest();

  const handleFinish = (distortion: boolean) => {
    updateScore('amslerGridDistortion', distortion);
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Amsler Grid</H2>
      <P className="text-[var(--text-secondary)] mb-6">
        Focus on the central dot. Do any of the lines appear wavy, distorted, or missing?
      </P>
      
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 border border-black dark:border-white">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-black/30 dark:border-white/30" />
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="flex gap-4">
        <Button onClick={() => handleFinish(true)} variant="secondary">Yes, some lines are wavy/missing</Button>
        <Button onClick={() => handleFinish(false)}>No, all lines look straight</Button>
      </div>
    </div>
  );
}
