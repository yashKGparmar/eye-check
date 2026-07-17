import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"

export default function NightVisionStep() {
  const { nextStep, updateQuestionnaire } = useVisionTest();

  const handleSelect = (val: boolean) => {
    updateQuestionnaire({ nightDrivingIssues: val });
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Night Vision Assessment</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Do you struggle with glare from headlights or seeing halos around lights at night?
      </P>
      
      <div className="w-32 h-32 bg-yellow-500 rounded-full shadow-[0_0_60px_20px_rgba(234,179,8,0.5)] mb-12" />

      <div className="flex gap-4">
        <Button onClick={() => handleSelect(true)}>Yes, it&apos;s difficult</Button>
        <Button onClick={() => handleSelect(false)} variant="secondary">No, it&apos;s fine</Button>
      </div>
    </div>
  );
}
