import { cn } from "@/lib/utils";

interface SegmentedProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const SegmentedProgressBar = ({ currentStep, totalSteps, className }: SegmentedProgressBarProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div
            key={index}
            className={cn(
              "h-3 rounded-full transition-all duration-500 ease-in-out border",
              {
                // Completed steps - fully filled with primary color
                "bg-primary border-primary shadow-sm": isCompleted,
                // Current step - partially filled (about 2/3)
                "bg-gradient-to-r from-primary via-primary to-primary/30 border-primary/50": isCurrent,
                // Future steps - empty with muted background
                "bg-muted/50 border-muted": stepNumber > currentStep,
              }
            )}
            style={{
              width: "40px", // Even larger width for better visibility
              minWidth: "40px", // Ensure minimum width
            }}
          />
        );
      })}
    </div>
  );
};

export default SegmentedProgressBar;
