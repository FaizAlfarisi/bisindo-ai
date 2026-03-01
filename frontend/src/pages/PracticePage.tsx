import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useWebcamAndHandDetection from '../hooks/useWebcamAndHandDetection';

const PracticePage = () => {
  const { letter } = useParams<{ letter: string }>();
  const [prediction, setPrediction] = useState<{ letter: string; confidence: number } | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const onNewLandmarks = useCallback(async (landmarks: { x: number; y: number; z: number }[][]) => {
    // Flatten the landmarks for a single hand (assuming numHands: 1 in the hook)
    // MediaPipe Hands gives landmarks as an array of arrays if multiple hands are detected
    // For BISINDO A-Z, we expect one hand.
    if (landmarks.length === 0) {
      setPrediction(null);
      return;
    }

    const singleHandLandmarks = landmarks[0]; // Take the first detected hand
    const flattenedLandmarks = singleHandLandmarks.flatMap(lm => [lm.x, lm.y, lm.z]);

    setLoadingPrediction(true);
    setPredictionError(null);

    try {
      // Placeholder for actual API call
      // In a real scenario, you'd send `flattenedLandmarks` to your FastAPI backend
      // Example:
      // const response = await fetch('/api/predict', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ landmarks: flattenedLandmarks })
      // });
      // const data = await response.json();
      // setPrediction(data);

      // Simulate API call
      const simulatedPrediction = {
        letter: String.fromCharCode(65 + Math.floor(Math.random() * 26)), // Random A-Z
        confidence: Math.random() * 0.4 + 0.6 // Random confidence 60-100%
      };
      setPrediction(simulatedPrediction);
    } catch (err) {
      console.error("Error sending landmarks to API:", err);
      setPredictionError("Failed to get prediction from AI. Please try again.");
    } finally {
      setLoadingPrediction(false);
    }
  }, []); // Empty dependency array, as this callback doesn't depend on external state that changes frequently

  const {
    videoRef,
    canvasRef,
    isHandLandmarkerLoaded,
    error: webcamError,
    startDetection,
    stopDetection,
  } = useWebcamAndHandDetection(onNewLandmarks, 150); // Throttle to ~6-7 FPS (150ms)

  useEffect(() => {
    if (isHandLandmarkerLoaded) {
      startDetection();
    }

    return () => {
      stopDetection();
    };
  }, [isHandLandmarkerLoaded, startDetection, stopDetection]);

  const displayLetter = letter ? letter.toUpperCase() : 'Letter';

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-4">Practice: {displayLetter}</h1>
      <p className="text-lg mb-4">Realtime practice with camera.</p>

      {webcamError && <p className="text-red-500 text-center mb-4">{webcamError}</p>}
      {!isHandLandmarkerLoaded && !webcamError && (
        <p className="text-blue-500 text-center mb-4">Loading hand detection model...</p>
      )}

      <div className="relative w-full max-w-2xl bg-black rounded-lg shadow-lg overflow-hidden mb-4">
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto transform scaleX(-1)"></video>
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full transform scaleX(-1)"></canvas>
      </div>

      <div className="text-center">
        {loadingPrediction && <p className="text-gray-600">Sending to AI for prediction...</p>}
        {predictionError && <p className="text-red-500">{predictionError}</p>}
        {prediction && (
          <p className="text-2xl font-semibold">
            AI Predicts: <span className="text-green-600">{prediction.letter}</span> (Confidence: {(prediction.confidence * 100).toFixed(2)}%)
          </p>
        )}
      </div>

      <div className="mt-4 p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">Target: {displayLetter}</h2>
        {/* Placeholder for visual feedback (e.g., green/red box around target letter) */}
        {prediction && prediction.letter === displayLetter && prediction.confidence > 0.7 
          ? <p className="text-green-500">Correct!</p> 
          : <p className="text-red-500">Keep trying!</p>}
      </div>

    </div>
  );
};

export default PracticePage;