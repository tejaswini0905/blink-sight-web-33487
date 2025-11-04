import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// All 90 COCO-SSD object classes organized by category
const OBJECT_CATEGORIES = {
  "People & Body": ["person"],
  "Animals": ["bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe"],
  "Vehicles": ["bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat"],
  "Traffic & Outdoor": ["traffic light", "fire hydrant", "stop sign", "parking meter", "bench"],
  "Accessories": ["backpack", "umbrella", "handbag", "tie", "suitcase"],
  "Sports": ["frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket"],
  "Kitchen & Dining": ["bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl"],
  "Food": ["banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake"],
  "Furniture": ["chair", "couch", "potted plant", "bed", "dining table", "toilet"],
  "Electronics": ["tv", "laptop", "mouse", "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator"],
  "Household": ["book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"],
};

interface FilterPanelProps {
  selectedObjects: string[];
  onFilterChange: (objects: string[]) => void;
}

export const FilterPanel = ({ selectedObjects, onFilterChange }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const allObjects = Object.values(OBJECT_CATEGORIES).flat();
  const isAllSelected = selectedObjects.length === 0;
  const selectedCount = selectedObjects.length;

  const toggleObject = (object: string) => {
    if (selectedObjects.includes(object)) {
      onFilterChange(selectedObjects.filter((o) => o !== object));
    } else {
      onFilterChange([...selectedObjects, object]);
    }
  };

  const toggleCategory = (category: string[]) => {
    const allInCategory = category.every((obj) => selectedObjects.includes(obj));
    if (allInCategory) {
      onFilterChange(selectedObjects.filter((o) => !category.includes(o)));
    } else {
      const newSelection = [...new Set([...selectedObjects, ...category])];
      onFilterChange(newSelection);
    }
  };

  const selectAll = () => {
    onFilterChange([]);
  };

  const clearAll = () => {
    onFilterChange(allObjects);
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Object Filter
        </h3>
        {!isAllSelected && (
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            {selectedCount} selected
          </Badge>
        )}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-border hover:border-primary/50 transition-colors"
          >
            <span className="truncate">
              {isAllSelected ? "All Objects" : `${selectedCount} object${selectedCount !== 1 ? 's' : ''} selected`}
            </span>
            <Filter className="h-4 w-4 ml-2 flex-shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 bg-card border-border z-50" align="start">
          <div className="max-h-[500px] overflow-y-auto">
            {/* Quick Actions */}
            <div className="sticky top-0 bg-card border-b border-border p-4 flex gap-2 z-10">
              <Button
                size="sm"
                variant="outline"
                onClick={selectAll}
                className="flex-1 border-primary/30 hover:border-primary"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Select All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearAll}
                className="flex-1 border-destructive/30 hover:border-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            {/* Categories */}
            {Object.entries(OBJECT_CATEGORIES).map(([categoryName, objects]) => {
              const allInCategory = objects.every((obj) => 
                isAllSelected || selectedObjects.includes(obj)
              );
              const someInCategory = objects.some((obj) => 
                isAllSelected || selectedObjects.includes(obj)
              );

              return (
                <div key={categoryName} className="border-b border-border last:border-0">
                  <div className="p-4 bg-background/30">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id={categoryName}
                        checked={allInCategory}
                        onCheckedChange={() => toggleCategory(objects)}
                        className="border-primary data-[state=checked]:bg-primary"
                      />
                      <Label
                        htmlFor={categoryName}
                        className="text-sm font-semibold cursor-pointer text-foreground"
                      >
                        {categoryName}
                      </Label>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {objects.length}
                      </Badge>
                    </div>
                    <div className="ml-6 space-y-2">
                      {objects.map((object) => (
                        <div key={object} className="flex items-center space-x-2">
                          <Checkbox
                            id={object}
                            checked={isAllSelected || selectedObjects.includes(object)}
                            onCheckedChange={() => toggleObject(object)}
                            className="border-border data-[state=checked]:bg-primary"
                          />
                          <Label
                            htmlFor={object}
                            className="text-sm cursor-pointer capitalize text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {object}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {!isAllSelected && selectedCount > 0 && (
        <div className="mt-3 space-y-2">
          <div className="text-xs text-muted-foreground">Active filters:</div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {selectedObjects.slice(0, 10).map((obj) => (
              <Badge
                key={obj}
                variant="secondary"
                className="text-xs bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 cursor-pointer"
                onClick={() => toggleObject(obj)}
              >
                {obj}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedCount > 10 && (
              <Badge variant="outline" className="text-xs">
                +{selectedCount - 10} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
