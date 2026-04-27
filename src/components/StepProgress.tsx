import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface StepProgressProps {
  steps: { key: string; label: string }[];
  currentIndex: number;
}

const StepProgress = ({ steps, currentIndex }: StepProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {steps.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={s.key} className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={false}
                animate={{ scale: active ? 1.05 : 1 }}
                className={`relative flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "gradient-primary text-primary-foreground animate-pulse-glow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </motion.div>
              <span
                className={`text-[10px] font-medium uppercase tracking-wider ${
                  active ? "text-foreground" : "text-muted-foreground/70"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="relative -mt-4 h-px w-6 sm:w-10 bg-border overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                  className="h-full gradient-primary"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;