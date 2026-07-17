import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"

export default function AlignmentStep() {
  const { nextStep } = useVisionTest();

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Eye Alignment</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Look at the red line and the green dot. Do they align? (Educational screening only)
      </P>
      
      <div className="relative w-64 h-64 border border-[var(--input-border)] mb-8 flex items-center justify-center bg-black">
        <div className="absolute w-full h-1 bg-red-500 opacity-80" />
        <div className="absolute w-4 h-4 bg-green-500 rounded-full opacity-80" />
      </div>

      <div className="flex gap-4">
        <Button onClick={nextStep} variant="secondary">They cross/align</Button>
        <Button onClick={nextStep} variant="secondary">They don&apos;t align</Button>
      </div>
      <Button variant="ghost" onClick={nextStep} className="mt-4">Skip</Button>
    </div>
  );
}
