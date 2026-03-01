import { useRef, useEffect, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';
// import { NormalizedLandmark } from '@mediapipe/hands'; // Not directly needed with tasks-vision result format

// Define a type for a single landmark (x, y, z)
interface Landmark {
  x: number;
  y: number;
  z: number;
}

// Define a type for the HandLandmark array (21 landmarks * 3 coordinates)
type HandLandmarks = Landmark[];


interface HandDetectionHookResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isHandLandmarkerLoaded: boolean;
  handLandmarkerResult: HandLandmarkerResult | null;
  error: string | null;
  startDetection: () => void;
  stopDetection: () => void;
}

const useWebcamAndHandDetection = (
  onNewLandmarks: (landmarks: HandLandmarks[]) => void, // Changed to HandLandmarks[] to handle multiple hands
  throttleTimeMs: number = 100 // Default to 10 FPS
): HandDetectionHookResult => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [isHandLandmarkerLoaded, setIsHandLandmarkerLoaded] = useState(false);
  const [handLandmarkerResult, setHandLandmarkerResult] = useState<HandLandmarkerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastDetectionTime = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);


  // Load MediaPipe Hand Landmarker model
  useEffect(() => {
    const loadHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        // Using the hand_landmarker model, not gesture_recognizer directly for just landmarks
        const landmarker = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 1 // We are focusing on single hand detection for BISINDO A-Z
          });
        setHandLandmarker(landmarker);
        setIsHandLandmarkerLoaded(true);
      } catch (err) {
        console.error("Failed to load HandLandmarker:", err);
        setError("Failed to load hand detection model.");
      }
    };

    loadHandLandmarker();

    return () => {
      if (handLandmarker) {
        handLandmarker.close();
      }
    };
  }, [handLandmarker]);

  // Start webcam and hand detection
  const startDetection = useCallback(() => {
    if (!handLandmarker || !videoRef.current || !canvasRef.current) {
      setError("Hand Landmarker not loaded or video/canvas not ready.");
      return;
    }

    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Could not access webcam. Please ensure it's connected and permissions are granted.");
        return;
      }

      const detectHands = () => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');

          if (!context) {
            setError("Failed to get 2D context from canvas.");
            return;
          }

          // Set canvas dimensions to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Only perform detection if the video is ready and playing
          if (video.readyState >= 2) {
            const now = performance.now();
            if (now - lastDetectionTime.current >= throttleTimeMs) {
              const result = handLandmarker.detectForVideo(video, now);
              setHandLandmarkerResult(result);

              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame

              if (result.landmarks && result.landmarks.length > 0) {
                // Draw landmarks and connections
                for (const landmarks of result.landmarks) {
                  // For now, let's just draw points
                  context.fillStyle = 'red';
                  for (const landmark of landmarks) {
                    context.beginPath();
                    context.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
                    context.fill();
                  }
                }
                // Send all detected hand landmarks
                onNewLandmarks(result.landmarks.map(hand => hand.map(lm => ({ x: lm.x, y: lm.y, z: lm.z }))));
              }
              lastDetectionTime.current = now;
            }
          }
        }
        animationFrameId.current = requestAnimationFrame(detectHands);
      };

      animationFrameId.current = requestAnimationFrame(detectHands);
    };

    setupWebcam();
  }, [handLandmarker, onNewLandmarks, throttleTimeMs]);

  // Stop webcam and detection
  const stopDetection = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setError(null);
    setHandLandmarkerResult(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return { videoRef, canvasRef, isHandLandmarkerLoaded, handLandmarkerResult, error, startDetection, stopDetection };
};

export default useWebcamAndHandDetection;