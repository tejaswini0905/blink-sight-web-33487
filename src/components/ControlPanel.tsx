import { Button } from "@/components/ui/button";
import { Play, Pause, Camera } from "lucide-react";

interface ControlPanelProps {
  isDetecting: boolean;
  onToggleDetection: () => void;
}

export const ControlPanel = ({ isDetecting, onToggleDetection }: ControlPanelProps) => {
  return (
    <div className="flex gap-4 justify-center">
      <Button
        onClick={onToggleDetection}
        size="lg"
        className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-[var(--shadow-glow)]"
      >
        {isDetecting ? (
          <>
            <Pause className="h-5 w-5" />
            Pause Detection
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            Start Detection
          </>
        )}
      </Button>
    </div>
  );
};
