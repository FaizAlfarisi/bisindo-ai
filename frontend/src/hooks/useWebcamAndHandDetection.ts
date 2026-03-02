import { useRef, useEffect, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker, type HandLandmarkerResult } from '@mediapipe/tasks-vision';

// Define hand connections manually since they are not exported directly in some versions
const HAND_CONNECTIONS = [
  { start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 4 }, // Thumb
  { start: 0, end: 5 }, { start: 5, end: 6 }, { start: 6, end: 7 }, { start: 7, end: 8 }, // Index
  { start: 0, end: 9 }, { start: 9, end: 10 }, { start: 10, end: 11 }, { start: 11, end: 12 }, // Middle
  { start: 0, end: 13 }, { start: 13, end: 14 }, { start: 14, end: 15 }, { start: 15, end: 16 }, // Ring
  { start: 0, end: 17 }, { start: 17, end: 18 }, { start: 18, end: 19 }, { start: 19, end: 20 }, // Pinky
  { start: 5, end: 9 }, { start: 9, end: 13 }, { start: 13, end: 17 } // Palm
];

interface HandData {
  label: string;
  landmarks: number[][]; // [x, y, z]
}

interface HandDetectionHookResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isHandLandmarkerLoaded: boolean;
  handLandmarkerResult: HandLandmarkerResult | null;
  error: string | null;
  startDetection: () => void;
  stopDetection: () => void;
}

const useWebcamAndHandDetection = (
  onNewLandmarks: (handsData: HandData[]) => void, 
  throttleTimeMs: number = 200 // Default to 5 FPS to reduce load
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
    let isMounted = true;
    const loadHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
              delegate: "CPU"
            },
            runningMode: "VIDEO",
            numHands: 2
          });
        
        if (isMounted) {
          setHandLandmarker(landmarker);
          setIsHandLandmarkerLoaded(true);
        } else {
          landmarker.close();
        }
      } catch (err) {
        console.error("Failed to load HandLandmarker:", err);
        if (isMounted) setError("Failed to load hand detection model.");
      }
    };

    loadHandLandmarker();

    return () => {
      isMounted = false;
      // Note: We don't close landmarker here to avoid closing it while still in use
      // It will be closed when the component unmounts via the cleanup below
    };
  }, []); // Empty dependency array to run only once

  // Proper cleanup for the handLandmarker
  useEffect(() => {
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
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 480 } } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Could not access webcam.");
        return;
      }

      const detectHands = () => {
        if (videoRef.current && canvasRef.current && handLandmarker) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');

          if (!context) return;

          // Only set canvas size once or when video size changes
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          if (video.readyState >= 2) {
            const now = performance.now();
            if (now - lastDetectionTime.current >= throttleTimeMs) {
              const result = handLandmarker.detectForVideo(video, now);
              setHandLandmarkerResult(result);

              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              if (result.landmarks && result.landmarks.length > 0) {
                // Draw skeleton and landmarks
                for (const landmarks of result.landmarks) {
                  // Draw connections
                  context.strokeStyle = 'white';
                  context.lineWidth = 2;
                  for (const connection of HAND_CONNECTIONS) {
                    const start = landmarks[connection.start];
                    const end = landmarks[connection.end];
                    if (start && end) {
                      context.beginPath();
                      context.moveTo(start.x * canvas.width, start.y * canvas.height);
                      context.lineTo(end.x * canvas.width, end.y * canvas.height);
                      context.stroke();
                    }
                  }

                  // Draw landmark points
                  context.fillStyle = 'red';
                  for (const landmark of landmarks) {
                    context.beginPath();
                    context.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
                    context.fill();
                  }
                }

                if (result.worldLandmarks && result.worldLandmarks.length > 0) {
                  const handsData: HandData[] = result.worldLandmarks.map((handWorldLandmarks, index) => {
                    const handedness = result.handednesses[index];
                    const label = handedness && handedness[0] ? handedness[0].categoryName : "Right";
                    const landmarks = handWorldLandmarks.map(lm => [lm.x, lm.y, lm.z]);
                    return { label, landmarks };
                  });
                  onNewLandmarks(handsData);
                }
              } else {
                 onNewLandmarks([]);
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
