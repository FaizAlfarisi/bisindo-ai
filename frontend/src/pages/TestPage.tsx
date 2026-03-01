import { useEffect, useState, useCallback } from 'react';
import useWebcamAndHandDetection from '../hooks/useWebcamAndHandDetection';

const TestPage = () => {
  const [prediction, setPrediction] = useState<{ letter: string; confidence: number } | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // In a real test scenario, this would involve a sequence of target letters
  // and logic to evaluate correctness and manage the test flow.
  const [targetLetter, setTargetLetter] = useState<string>('A'); // Placeholder target letter for now

  const onNewLandmarks = useCallback(async (landmarks: { x: number; y: number; z: number }[][]) => {
    if (landmarks.length === 0) {
      setPrediction(null);
      return;
    }

    const singleHandLandmarks = landmarks[0];
    const flattenedLandmarks = singleHandLandmarks.flatMap(lm => [lm.x, lm.y, lm.z]);

    setLoadingPrediction(true);
    setPredictionError(null);

    try {
      // Simulate API call
      const simulatedPrediction = {
        letter: String.fromCharCode(65 + Math.floor(Math.random() * 26)), // Random A-Z
        confidence: Math.random() * 0.4 + 0.6 // Random confidence 60-100%
      };
      setPrediction(simulatedPrediction);
      // In a real test, you'd have logic here to check if simulatedPrediction.letter matches targetLetter
    } catch (err) {
      console.error("Error sending landmarks to API:", err);
      setPredictionError("Failed to get prediction from AI. Please try again.");
    } finally {
      setLoadingPrediction(false);
    }
  }, []);

  const {
    videoRef,
    canvasRef,
    isHandLandmarkerLoaded,
    error: webcamError,
    startDetection,
    stopDetection,
  } = useWebcamAndHandDetection(onNewLandmarks, 200); // Slightly less frequent updates for test mode (5 FPS)

  useEffect(() => {
    if (isHandLandmarkerLoaded) {
      startDetection();
    }

    return () => {
      stopDetection();
    };
  }, [isHandLandmarkerLoaded, startDetection, stopDetection]);

  // Placeholder for a simple mechanism to change target letter for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetLetter(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    }, 5000); // Change target letter every 5 seconds
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-4">Test Your Knowledge</h1>
      <p className="text-lg mb-4">Timed test mode.</p>

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
        <h2 className="text-2xl font-bold">Current Target: {targetLetter}</h2>
        {/* Placeholder for visual feedback (e.g., green/red box around target letter) */}
        {prediction && prediction.letter === targetLetter && prediction.confidence > 0.7 
          ? <p className="text-green-500">Correct!</p> 
          : <p className="text-red-500">Try for {targetLetter}!</p>}
      </div>

    </div>
  );
};

export default TestPage;