import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"

export default function DepthPerceptionStep() {
  const { nextStep, updateScore } = useVisionTest();

  const handleFinish = (score: number) => {
    updateScore('depthPerception', score);
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Depth Perception</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Which circle appears to be floating closer to you?
      </P>
      
      <div className="flex gap-8 mb-12">
        <button
          type="button"
          aria-label="Select red circle as closer"
          className="w-32 h-32 bg-red-500 rounded-full shadow-[10px_10px_30px_rgba(0,0,0,0.5)] transform scale-110 cursor-pointer"
          onClick={() => handleFinish(100)}
        />
        <button
          type="button"
          aria-label="Select blue circle as closer"
          className="w-32 h-32 bg-blue-500 rounded-full shadow-sm cursor-pointer"
          onClick={() => handleFinish(0)}
        />
      </div>

      <Button onClick={() => handleFinish(50)} variant="secondary">I&apos;m not sure</Button>
    </div>
  );
}
