import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

interface DetectionStatsProps {
  detections: Detection[];
  fps: number;
  isDetecting: boolean;
}

export const DetectionStats = ({ detections, fps, isDetecting }: DetectionStatsProps) => {
  const detectionCounts = detections.reduce((acc, detection) => {
    acc[detection.class] = (acc[detection.class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDetections = Object.entries(detectionCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Performance</h2>
          <Badge variant={isDetecting ? "default" : "secondary"} className="animate-pulse">
            {isDetecting ? "Active" : "Paused"}
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">FPS</span>
            <span className="text-2xl font-bold text-primary">{fps.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Objects Detected</span>
            <span className="text-2xl font-bold text-accent">{detections.length}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Detected Objects</h2>
        {sortedDetections.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No objects detected yet</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {sortedDetections.map(([className, count]) => (
              <div
                key={className}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <span className="font-medium text-foreground capitalize">{className}</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
