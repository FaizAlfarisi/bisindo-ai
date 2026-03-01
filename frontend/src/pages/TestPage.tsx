import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import useWebcamAndHandDetection from '../hooks/useWebcamAndHandDetection';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const NUMBER_OF_QUESTIONS = 10;
const TIME_PER_QUESTION_SECONDS = 5;
const MIN_CONFIDENCE_FOR_CORRECT = 0.8; // Confidence threshold to count as correct

const TestPage = () => {
  const navigate = useNavigate();

  // Test state
  const [testQuestions, setTestQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Prediction state from AI
  const [prediction, setPrediction] = useState<{ letter: string; confidence: number } | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  
  // State for immediate feedback during a question
  const [currentQuestionFeedback, setCurrentQuestionFeedback] = useState<'correct' | 'incorrect' | 'neutral'>('neutral');
  const hasAnsweredCorrectlyInTime = useRef(false); // To ensure only one correct answer per question


  // --- Helper Functions ---
  const generateRandomQuestions = useCallback(() => {
    const shuffled = [...ALL_LETTERS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, NUMBER_OF_QUESTIONS);
  }, []);

  const resetTest = useCallback(() => {
    setTestQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setWrongLetters([]);
    setTestStarted(false);
    setTestFinished(false);
    setTimeLeft(TIME_PER_QUESTION_SECONDS);
    setPrediction(null);
    setPredictionError(null);
    setCurrentQuestionFeedback('neutral');
    hasAnsweredCorrectlyInTime.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTest = useCallback(() => {
    resetTest(); // Ensure clean state
    setTestQuestions(generateRandomQuestions());
    setTestStarted(true);
    setCurrentQuestionIndex(0);
    setTimeLeft(TIME_PER_QUESTION_SECONDS);
    hasAnsweredCorrectlyInTime.current = false;
  }, [generateRandomQuestions, resetTest]);

  const advanceQuestion = useCallback(() => {
    // Stop current question timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Evaluate if no correct answer was given in time
    if (!hasAnsweredCorrectlyInTime.current && testStarted) {
      const currentTarget = testQuestions[currentQuestionIndex];
      if (currentTarget) {
         setWrongLetters((prev) => [...prev, currentTarget]);
      }
    }
    
    setCurrentQuestionFeedback('neutral');
    hasAnsweredCorrectlyInTime.current = false; // Reset for next question
    setPrediction(null); // Clear prediction for new question

    if (currentQuestionIndex < NUMBER_OF_QUESTIONS - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(TIME_PER_QUESTION_SECONDS);
    } else {
      setTestFinished(true);
      setTestStarted(false); // End the test
    }
  }, [currentQuestionIndex, testQuestions, testStarted]);


  // --- Timer Effect ---
  useEffect(() => {
    if (testStarted && !testFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted && !testFinished) {
      advanceQuestion(); // Time's up, advance
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, testStarted, testFinished, advanceQuestion]);

  const saveTestResult = useCallback(async (finalScore: number, wrongLettersList: string[]) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn("Cannot save test results: Authentication token not found.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          score: finalScore / NUMBER_OF_QUESTIONS, // Normalized score (0.0 to 1.0)
          total_correct: finalScore,
          total_questions: NUMBER_OF_QUESTIONS,
          wrong_letters: JSON.stringify(wrongLettersList) // Stored as JSON string in backend
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save test results.');
      }
      console.log("Test results saved successfully!");
    } catch (err) {
      console.error("Error saving test results:", err);
      // Optionally show a user-facing error
    }
  }, []); // Dependencies are stable here

  // Effect to save test results when finished
  useEffect(() => {
    if (testFinished) {
      saveTestResult(score, wrongLetters);
    }
  }, [testFinished, score, wrongLetters, saveTestResult]);

  // --- Webcam and Hand Detection Hook ---
  const onNewLandmarks = useCallback(async (landmarks: { x: number; y: number; z: number }[][]) => {
    if (!testStarted || testFinished) return; // Only process if test is running

    if (landmarks.length === 0) {
      setPrediction(null);
      return;
    }

    const singleHandLandmarks = landmarks[0];
    const flattenedLandmarks = singleHandLandmarks.flatMap(lm => [lm.x, lm.y, lm.z]);

    setLoadingPrediction(true);
    setPredictionError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setPredictionError("Authentication token not found. Please log in.");
        setLoadingPrediction(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ landmarks: flattenedLandmarks })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get prediction from AI.');
      }

      const data = await response.json();
      setPrediction(data);

      // --- Test Evaluation Logic ---
      const currentTargetLetter = testQuestions[currentQuestionIndex];
      if (currentTargetLetter && data.letter === currentTargetLetter && data.confidence >= MIN_CONFIDENCE_FOR_CORRECT) {
        if (!hasAnsweredCorrectlyInTime.current) { // Only count once per question
            setScore((prev) => prev + 1);
            setCurrentQuestionFeedback('correct');
            hasAnsweredCorrectlyInTime.current = true; // Mark as answered
            // Give a short delay before advancing to show "Correct!" feedback
            setTimeout(advanceQuestion, 1000); 
        }
      } else if (data.letter !== currentTargetLetter && data.confidence >= 0.5) { // If confidently wrong, show incorrect feedback
          setCurrentQuestionFeedback('incorrect');
      } else {
          setCurrentQuestionFeedback('neutral');
      }

    } catch (err: any) {
      console.error("Error sending landmarks to API:", err);
      setPredictionError(err.message || "Failed to get prediction from AI. Please try again.");
    } finally {
      setLoadingPrediction(false);
    }
  }, [testStarted, testFinished, testQuestions, currentQuestionIndex, advanceQuestion]);

  const {
    videoRef,
    canvasRef,
    isHandLandmarkerLoaded,
    error: webcamError,
    startDetection,
    stopDetection,
  } = useWebcamAndHandDetection(onNewLandmarks, 150); // Consistent throttle with practice page

  // Start/Stop webcam based on test state
  useEffect(() => {
    if (isHandLandmarkerLoaded && testStarted && !testFinished) {
      startDetection();
    } else {
      stopDetection();
    }

    return () => {
      stopDetection();
    };
  }, [isHandLandmarkerLoaded, testStarted, testFinished, startDetection, stopDetection]);


  // --- Render UI ---
  const currentTargetLetter = testQuestions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;

  const getFeedbackStyles = useCallback(() => {
    if (currentQuestionFeedback === 'correct') return "bg-green-500 text-white";
    if (currentQuestionFeedback === 'incorrect') return "bg-red-500 text-white";
    return "bg-gray-200 text-gray-800";
  }, [currentQuestionFeedback]);


  if (!testStarted && !testFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
        <h1 className="text-4xl font-bold mb-4">BISINDO Test</h1>
        <p className="text-lg mb-6">Test your knowledge of BISINDO letters!</p>
        <button
          onClick={startTest}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
        >
          Start Test ({NUMBER_OF_QUESTIONS} Questions)
        </button>
      </div>
    );
  }

  if (testFinished) {
    const finalAccuracy = (score / NUMBER_OF_QUESTIONS) * 100;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
        <h1 className="text-4xl font-bold mb-4">Test Complete!</h1>
        <p className="text-2xl mb-2">Your Score: {score} / {NUMBER_OF_QUESTIONS}</p>
        <p className="text-2xl mb-4">Accuracy: {finalAccuracy.toFixed(2)}%</p>
        {wrongLetters.length > 0 && (
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold text-red-600">Letters to Review:</h2>
            <p className="text-lg">{wrongLetters.join(', ')}</p>
          </div>
        )}
        <div className="space-x-4">
            <button
            onClick={startTest}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
            Retake Test
            </button>
            <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
            Go to Dashboard
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-4">Test: Question {questionNumber} of {NUMBER_OF_QUESTIONS}</h1>
      <p className="text-lg mb-4">Time Left: <span className="font-bold text-red-500">{timeLeft}s</span></p>

      {webcamError && <p className="text-red-500 text-center mb-4">{webcamError}</p>}
      {!isHandLandmarkerLoaded && !webcamError && (
        <p className="text-blue-500 text-center mb-4">Loading hand detection model...</p>
      )}

      <div className="relative w-full max-w-2xl bg-black rounded-lg shadow-lg overflow-hidden mb-4">
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto transform scaleX(-1)"></video>
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full transform scaleX(-1)"></canvas>
      </div>

      <div className="text-center mb-4">
        {loadingPrediction && <p className="text-gray-600">Sending to AI for prediction...</p>}
        {predictionError && <p className="text-red-500">{predictionError}</p>}
        {prediction && (
          <p className="text-2xl font-semibold">
            AI Predicts: <span className="text-green-600">{prediction.letter}</span> (Confidence: {(prediction.confidence * 100).toFixed(2)}%)
          </p>
        )}
      </div>

      <div className={`mt-4 p-4 rounded shadow ${getFeedbackStyles()} transition-colors duration-300 w-full max-w-sm`}>
        <h2 className="text-5xl font-bold text-center mb-2">Target: {currentTargetLetter}</h2>
        {currentQuestionFeedback === 'correct' && (
            <p className="text-center font-bold text-lg mt-2">Correct!</p>
        )}
        {currentQuestionFeedback === 'incorrect' && (
            <p className="text-center font-bold text-lg mt-2">Incorrect!</p>
        )}
      </div>

    </div>
  );
};

export default TestPage;