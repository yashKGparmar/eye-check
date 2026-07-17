import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"
import { motion } from "framer-motion"

export default function BlinkExerciseStep() {
  const { nextStep } = useVisionTest();
  const [timeLeft, setTimeLeft] = React.useState(20);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      nextStep();
    }
  }, [isActive, timeLeft, nextStep]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center">
      <H2 className="mb-4">Blink Exercise</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Relax your eyes. Follow the animation and blink every time the circle pulses.
      </P>
      
      {!isActive ? (
        <Button onClick={() => setIsActive(true)} size="lg">Start Exercise (20s)</Button>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 bg-blue-500/20 rounded-full"
            />
            <div className="text-5xl font-bold text-blue-500">{timeLeft}</div>
          </div>
          <Button variant="ghost" onClick={nextStep}>Skip Exercise</Button>
        </div>
      )}
    </div>
  );
}
