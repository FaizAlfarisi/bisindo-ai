import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useWebcamAndHandDetection from '../hooks/useWebcamAndHandDetection';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const PracticePage = () => {
  const { letter } = useParams<{ letter: string }>();
  const [prediction, setPrediction] = useState<{ letter: string; confidence: number } | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [progressSaved, setProgressSaved] = useState(false); // To track if progress was just saved

  // Ref to store last successful confidence to prevent repeated saves
  const lastSavedConfidenceRef = useRef<number>(0); 

  const saveProgress = useCallback(async (currentLetter: string, confidence: number, isMastered: boolean) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn("Cannot save progress: Authentication token not found.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          letter: currentLetter,
          highest_confidence: confidence,
          is_mastered: isMastered
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save progress.');
      }
      
      setProgressSaved(true); // Indicate success
      lastSavedConfidenceRef.current = confidence; // Update ref with current confidence
      console.log(`Progress saved for ${currentLetter}: Confidence ${confidence.toFixed(2)}, Mastered: ${isMastered}`);

    } catch (err) {
      console.error("Error saving progress:", err);
      // Optionally show a user-facing error for saving progress
    }
  }, []);

  const onNewLandmarks = useCallback(async (landmarks: { x: number; y: number; z: number }[][]) => {
    if (landmarks.length === 0) {
      setPrediction(null);
      return;
    }

    const singleHandLandmarks = landmarks[0]; // Take the first detected hand
    const flattenedLandmarks = singleHandLandmarks.flatMap(lm => [lm.x, lm.y, lm.z]);

    setLoadingPrediction(true);
    setPredictionError(null);

    try {
      const token = localStorage.getItem('access_token'); // Get token from localStorage
      if (!token) {
        setPredictionError("Authentication token not found. Please log in.");
        setLoadingPrediction(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Attach JWT token
        },
        body: JSON.stringify({ landmarks: flattenedLandmarks })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get prediction from AI.');
      }

      const data = await response.json();
      setPrediction(data);

      // --- New: Logic to save progress ---
      if (letter && data.letter === letter.toUpperCase()) {
        if (data.confidence >= 0.6 && data.confidence > lastSavedConfidenceRef.current) {
          // If confidence is good and higher than last saved, save progress
          const isMastered = data.confidence >= 0.8;
          saveProgress(letter.toUpperCase(), data.confidence, isMastered);
        }
      }
      // --- End new logic ---

    } catch (err: any) {
      console.error("Error sending landmarks to API:", err);
      setPredictionError(err.message || "Failed to get prediction from AI. Please try again.");
    } finally {
      setLoadingPrediction(false);
    }
  }, [letter, saveProgress]);


  // Reset progressSaved state when target letter changes
  useEffect(() => {
    setProgressSaved(false);
    lastSavedConfidenceRef.current = 0; // Reset last saved confidence for new letter
  }, [letter]);


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

  const getFeedbackStyles = useCallback(() => {
    if (!prediction || !letter) {
      return "bg-gray-200 text-gray-800"; // Default style
    }
    const isCorrectLetter = prediction.letter === letter.toUpperCase();
    if (isCorrectLetter && prediction.confidence >= 0.8) {
      return "bg-green-500 text-white"; // Strong correct
    } else if (isCorrectLetter && prediction.confidence >= 0.6) {
      return "bg-yellow-400 text-gray-800"; // Weak correct
    } else {
      return "bg-red-500 text-white"; // Incorrect or low confidence
    }
  }, [prediction, letter]);


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

      <div className={`mt-4 p-4 rounded shadow ${getFeedbackStyles()} transition-colors duration-300 w-full max-w-sm`}>
        <h2 className="text-2xl font-bold text-center mb-2">Target: {displayLetter}</h2>
        {prediction && (
          <p className="text-xl text-center">
            You are signing: <span className="font-semibold">{prediction.letter}</span> ({(prediction.confidence * 100).toFixed(1)}%)
          </p>
        )}
        {prediction && prediction.letter === displayLetter && prediction.confidence >= 0.8
          ? <p className="text-center font-bold text-lg mt-2">Correct!</p>
          : <p className="text-center font-bold text-lg mt-2">Keep trying!</p>}
      </div>
      {progressSaved && (
        <p className="text-green-600 text-sm mt-2">Progress updated successfully!</p>
      )}

    </div>
  );
};

export default PracticePage;
