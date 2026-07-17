import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"

export default function EyeDominanceStep() {
  const { nextStep, updateScore } = useVisionTest();

  const handleSelect = (eye: 'left' | 'right') => {
    updateScore('eyeDominance', eye);
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Eye Dominance Test</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Extend your arms in front of you and create a triangular opening between your thumbs and forefingers. 
        Center a distant object within that triangle with both eyes open.
      </P>
      
      <div className="w-48 h-48 border-4 border-dashed border-[var(--input-border)] rounded-full mb-8 flex items-center justify-center text-4xl">
        🔺
      </div>

      <P className="mb-6 font-medium">Now, close your left eye. Does the object jump out of the triangle?</P>
      
      <div className="flex gap-4">
        <Button onClick={() => handleSelect('right')}>Yes (Right Dominant)</Button>
        <Button onClick={() => handleSelect('left')} variant="secondary">No (Left Dominant)</Button>
      </div>
    </div>
  );
}
