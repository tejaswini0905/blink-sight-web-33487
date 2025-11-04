import { useState } from "react";
import { WebcamStream } from "@/components/WebcamStream";
import { DetectionStats } from "@/components/DetectionStats";
import { ControlPanel } from "@/components/ControlPanel";
import { FilterPanel } from "@/components/FilterPanel";
import { ConfidenceControl } from "@/components/ConfidenceControl";
import { Scan } from "lucide-react";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

const Index = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [fps, setFps] = useState(0);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  const toggleDetection = () => {
    setIsDetecting((prev) => !prev);
  };

  const handleFilterChange = (objects: string[]) => {
    setSelectedObjects(objects);
  };

  const handleConfidenceChange = (value: number) => {
    setConfidenceThreshold(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-glow)]">
              <Scan className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              AI Object Detection
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time object detection powered by TensorFlow.js - Runs entirely in your browser
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Stream */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-card rounded-lg overflow-hidden border-2 border-border">
              <WebcamStream
                isDetecting={isDetecting}
                onDetectionUpdate={setDetections}
                onFpsUpdate={setFps}
                selectedObjects={selectedObjects}
                confidenceThreshold={confidenceThreshold}
              />
            </div>
            <ControlPanel isDetecting={isDetecting} onToggleDetection={toggleDetection} />
          </div>

          {/* Stats & Filter Panel */}
          <div className="lg:col-span-1 space-y-4">
            <ConfidenceControl 
              confidence={confidenceThreshold}
              onConfidenceChange={handleConfidenceChange}
            />
            <FilterPanel 
              selectedObjects={selectedObjects}
              onFilterChange={handleFilterChange}
            />
            <DetectionStats detections={detections} fps={fps} isDetecting={isDetecting} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>All processing happens locally in your browser - No data is sent to any server</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
