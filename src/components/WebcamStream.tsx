import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

interface WebcamStreamProps {
  isDetecting: boolean;
  onDetectionUpdate: (detections: Detection[]) => void;
  onFpsUpdate: (fps: number) => void;
  selectedObjects: string[];
  confidenceThreshold: number;
}

export const WebcamStream = ({ 
  isDetecting, 
  onDetectionUpdate, 
  onFpsUpdate, 
  selectedObjects, 
  confidenceThreshold 
}: WebcamStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(Date.now());
  const fpsHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading AI model for optimal detection...");
        // Load with the most accurate configuration
        const loadedModel = await cocoSsd.load({
          base: 'mobilenet_v2', // Most accurate base model
          modelUrl: undefined // Use default CDN for best performance
        });
        console.log("AI model loaded successfully!");
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (error) {
        console.error("Error loading model:", error);
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        console.log("Starting webcam with optimal settings...");
        // Request maximum quality settings for best detection
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            frameRate: { ideal: 60, min: 30 },
            facingMode: "user",
            aspectRatio: { ideal: 16/9 }
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Webcam started successfully!");
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!model || !isDetecting) return;

    const detectObjects = async () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Detect with maximum detections and optimal threshold for accuracy
        // Using 20 as maxNumBoxes for better performance while maintaining accuracy
        const predictions = await model.detect(video, 20, confidenceThreshold / 2);

        // Filter predictions based on selected objects and apply confidence threshold
        let filteredPredictions = selectedObjects.length === 0 
          ? predictions 
          : predictions.filter(p => selectedObjects.includes(p.class));
        
        // Apply the confidence threshold for better accuracy
        filteredPredictions = filteredPredictions.filter(p => p.score >= confidenceThreshold);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        filteredPredictions.forEach((prediction) => {
          const [x, y, width, height] = prediction.bbox;
          const confidence = prediction.score;

          // Color based on confidence
          const getColor = (score: number) => {
            if (score >= 0.8) return "hsl(142 76% 56%)"; // Green for high confidence
            if (score >= 0.6) return "hsl(189 94% 55%)"; // Cyan for medium
            return "hsl(280 85% 65%)"; // Purple for lower confidence
          };

          const color = getColor(confidence);

          // Draw bounding box with glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          ctx.shadowBlur = 0;

          // Draw label background
          ctx.fillStyle = color;
          const text = `${prediction.class} ${(confidence * 100).toFixed(0)}%`;
          ctx.font = "bold 16px sans-serif";
          const textMetrics = ctx.measureText(text);
          const textHeight = 24;
          const padding = 8;
          ctx.fillRect(x, y - textHeight, textMetrics.width + padding, textHeight);

          // Draw label text
          ctx.fillStyle = "hsl(222 47% 11%)";
          ctx.fillText(text, x + padding / 2, y - 6);
        });

        onDetectionUpdate(filteredPredictions as Detection[]);

        // Calculate FPS
        const now = Date.now();
        const fps = 1000 / (now - lastFrameTimeRef.current);
        lastFrameTimeRef.current = now;
        
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 30) {
          fpsHistoryRef.current.shift();
        }
        
        const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
        onFpsUpdate(avgFps);
      }

      animationFrameRef.current = requestAnimationFrame(detectObjects);
    };

    detectObjects();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [model, isDetecting, onDetectionUpdate, onFpsUpdate, selectedObjects, confidenceThreshold]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[var(--shadow-card)]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-foreground">Loading AI Model...</p>
          </div>
        </div>
      )}
    </div>
  );
};
