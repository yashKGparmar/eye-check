import * as React from "react"
import { H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { useVisionTest } from "@/store/useVisionTest"
import { motion } from "framer-motion"

const targets = [
  { id: "upper-left", className: "top-10 left-10", delay: 1000 },
  { id: "lower-right", className: "bottom-10 right-10", delay: 2500 },
] as const

export default function PeripheralVisionStep() {
  const { nextStep, updateScore } = useVisionTest();
  const [visibleTargets, setVisibleTargets] = React.useState<Set<string>>(new Set());
  const [detectedTargets, setDetectedTargets] = React.useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = React.useState(false);
  const visibleTargetsRef = React.useRef(visibleTargets);
  const detectedTargetsRef = React.useRef(detectedTargets);

  React.useEffect(() => {
    visibleTargetsRef.current = visibleTargets;
  }, [visibleTargets]);

  React.useEffect(() => {
    detectedTargetsRef.current = detectedTargets;
  }, [detectedTargets]);

  const startTest = () => {
    setVisibleTargets(new Set());
    setDetectedTargets(new Set());
    setIsPlaying(true);
  };

  const markDetected = React.useCallback((id: string) => {
    setDetectedTargets((previous) => {
      if (previous.has(id)) return previous;
      const next = new Set(previous);
      next.add(id);
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (!isPlaying) return;

    const timers = targets.map((target) =>
      setTimeout(() => {
        setVisibleTargets((previous) => {
          const next = new Set(previous);
          next.add(target.id);
          return next;
        });
      }, target.delay)
    );

    const finishTimer = setTimeout(() => {
      const score = Math.round((detectedTargetsRef.current.size / targets.length) * 100);
      setIsPlaying(false);
      updateScore('peripheralVision', score);
      nextStep();
    }, 4500);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      const visibleUndetected = targets.find(
        (target) =>
          visibleTargetsRef.current.has(target.id) &&
          !detectedTargetsRef.current.has(target.id)
      );
      if (visibleUndetected) {
        markDetected(visibleUndetected.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, markDetected, nextStep, updateScore]);

  const dotsSeen = detectedTargets.size;

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full max-w-2xl mx-auto w-full text-center relative overflow-hidden">
      <H2 className="mb-4">Peripheral Vision</H2>
      <P className="text-[var(--text-secondary)] mb-8">
        Focus on the central cross. When you see dots appear on the edges, tap/click them or press the spacebar.
      </P>
      
      {!isPlaying ? (
        <Button onClick={startTest} size="lg">Start Test</Button>
      ) : (
        <div className="relative w-full h-[400px]">
          <div className="absolute top-1/2 left-1/2 text-4xl transform -translate-x-1/2 -translate-y-1/2 font-light">
            +
          </div>
          <div className="absolute top-4 right-4 text-sm text-[var(--text-secondary)]">
            Detected {dotsSeen}/{targets.length}
          </div>
          {targets.map((target) => (
            visibleTargets.has(target.id) && (
              <motion.button
                key={target.id}
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: detectedTargets.has(target.id) ? 0.2 : 1,
                  scale: detectedTargets.has(target.id) ? 0.75 : 1,
                }}
                className={`absolute ${target.className} w-5 h-5 bg-blue-500 rounded-full cursor-pointer`}
                onClick={() => markDetected(target.id)}
                aria-label={`Peripheral target ${target.id}`}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}
