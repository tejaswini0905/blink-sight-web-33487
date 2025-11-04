import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Gauge } from "lucide-react";

interface ConfidenceControlProps {
  confidence: number;
  onConfidenceChange: (value: number) => void;
}

export const ConfidenceControl = ({ confidence, onConfidenceChange }: ConfidenceControlProps) => {
  const handleChange = (values: number[]) => {
    onConfidenceChange(values[0]);
  };

  const getConfidenceLabel = () => {
    if (confidence <= 0.3) return "Very Sensitive";
    if (confidence <= 0.5) return "Balanced";
    if (confidence <= 0.7) return "Precise";
    return "Very Precise";
  };

  const getConfidenceColor = () => {
    if (confidence <= 0.3) return "bg-success/20 text-success border-success/30";
    if (confidence <= 0.5) return "bg-primary/20 text-primary border-primary/30";
    if (confidence <= 0.7) return "bg-accent/20 text-accent border-accent/30";
    return "bg-destructive/20 text-destructive border-destructive/30";
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          <Label className="text-lg font-semibold text-foreground">
            Detection Sensitivity
          </Label>
        </div>
        <Badge variant="outline" className={getConfidenceColor()}>
          {getConfidenceLabel()}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Confidence Threshold</span>
            <span className="font-bold text-primary">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[confidence]}
            onValueChange={handleChange}
            min={0.1}
            max={0.9}
            step={0.05}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>More Objects</span>
            <span>Higher Accuracy</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/50">
          <p className="mb-1"><strong>Tip:</strong></p>
          <p>Lower threshold = Detects more objects but may include false positives</p>
          <p>Higher threshold = More accurate but may miss some objects</p>
        </div>
      </div>
    </Card>
  );
};
