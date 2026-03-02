import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import useWebcamAndHandDetection from '../hooks/useWebcamAndHandDetection';
import { usePredictionWebSocket } from '../hooks/usePredictionWebSocket';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const TIME_PER_QUESTION_SECONDS = 15;
const TOTAL_QUESTIONS = 10; // Updated to 10

const TestPage = () => {
  const [testLetters, setTestLetters] = useState<string[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION_SECONDS);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'neutral'>('neutral');
  
  const timerRef = useRef<any>(null);
  const isProcessingRef = useRef<boolean>(false); // Lock to prevent multiple triggers

  const { prediction, wsError, isWsReady, sendLandmarks, setPrediction } = usePredictionWebSocket();

  // Initialize test letters (shuffle and pick 10)
  const initializeTest = useCallback(() => {
    const shuffled = [...ALL_LETTERS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, TOTAL_QUESTIONS);
    setTestLetters(selected);
    setQuestionsAnswered(0);
    setScore(0);
    setWrongLetters([]);
    setTestFinished(false);
    isProcessingRef.current = false;
  }, []);

  const finishTest = useCallback(async (finalScore: number, finalWrongs: string[]) => {
    setTestStarted(false);
    setTestFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/api/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          score: finalScore / TOTAL_QUESTIONS,
          total_correct: finalScore,
          total_questions: TOTAL_QUESTIONS,
          wrong_letters: JSON.stringify(finalWrongs)
        })
      });
    } catch (err) {
      console.error("Error saving test results:", err);
    }
  }, []);

  const handleNext = useCallback((isCorrect: boolean) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    if (timerRef.current) clearInterval(timerRef.current);

    let nextScore = score;
    let nextWrongs = [...wrongLetters];

    if (isCorrect) {
      nextScore += 1;
      setScore(nextScore);
      setFeedback('correct');
    } else {
      nextWrongs.push(testLetters[questionsAnswered]);
      setWrongLetters(nextWrongs);
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (questionsAnswered + 1 < TOTAL_QUESTIONS) {
        setQuestionsAnswered(prev => prev + 1);
        setTimeLeft(TIME_PER_QUESTION_SECONDS);
        setFeedback('neutral');
        setPrediction(null);
        isProcessingRef.current = false;
      } else {
        finishTest(nextScore, nextWrongs);
      }
    }, 1500);
  }, [questionsAnswered, score, testLetters, wrongLetters, finishTest, setPrediction]);

  // Timer Effect
  useEffect(() => {
    if (testStarted && !testFinished && !isProcessingRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleNext(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [testStarted, testFinished, handleNext]);

  // AI Prediction Effect
  useEffect(() => {
    const currentTarget = testLetters[questionsAnswered];
    if (testStarted && !isProcessingRef.current && prediction && prediction.letter === currentTarget && prediction.confidence >= 0.8) {
      handleNext(true);
    }
  }, [prediction, testLetters, questionsAnswered, testStarted, handleNext]);

  const onNewLandmarks = useCallback((handsData: any) => sendLandmarks(handsData), [sendLandmarks]);
  const { videoRef, canvasRef, isHandLandmarkerLoaded, startDetection, stopDetection, error: webcamError } = useWebcamAndHandDetection(onNewLandmarks, 150);

  useEffect(() => {
    if (isHandLandmarkerLoaded && testStarted) startDetection();
    return () => stopDetection();
  }, [isHandLandmarkerLoaded, testStarted, startDetection, stopDetection]);

  const currentLetter = testLetters[questionsAnswered] || '';

  if (testFinished) {
    return (
      <div className="bg-gray-50/50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
             🏁
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4">Test Complete!</h1>
          <p className="text-xl text-gray-500 font-medium mb-10">You've finished your BISINDO proficiency assessment.</p>
          
          <div className="grid grid-cols-2 gap-6 mb-12">
             <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <span className="block text-4xl font-black text-blue-600">{Math.round((score / TOTAL_QUESTIONS) * 100)}%</span>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Accuracy</span>
             </div>
             <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <span className="block text-4xl font-black text-gray-900">{score} / {TOTAL_QUESTIONS}</span>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Correct</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/dashboard" className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all hover:scale-105">
                Go to Dashboard
             </Link>
             <button onClick={() => window.location.reload()} className="flex-1 bg-gray-100 text-gray-800 py-5 rounded-2xl font-black text-lg transition-all hover:bg-gray-200">
                Retake Test
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {!testStarted ? (
          <div className="max-w-3xl mx-auto text-center py-20">
             <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h1 className="text-6xl font-black text-gray-900 mb-6">BISINDO Skills Test</h1>
             <p className="text-xl text-gray-500 font-medium mb-12 leading-relaxed">
               You'll be asked to sign 10 random letters. You have 15 seconds for each letter. <br/>
               Make sure your hands are clearly visible in the camera.
             </p>
             <button 
               onClick={() => { initializeTest(); setTestStarted(true); }}
               className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
             >
               Begin Assessment
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-8">
                <div className="flex justify-between items-end">
                   <div>
                      <span className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1 block">Question {questionsAnswered + 1} of {TOTAL_QUESTIONS}</span>
                      <h2 className="text-4xl font-black text-gray-900">Sign the letter <span className="text-blue-600">"{currentLetter}"</span></h2>
                   </div>
                   <div className="text-right">
                      <div className={`text-4xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-900'}`}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Remaining Time</span>
                   </div>
                </div>

                <div className="relative aspect-video bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100">
                   <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scaleX(-1)"></video>
                   <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover transform scaleX(-1)"></canvas>
                   
                   {feedback === 'correct' && (
                     <div className="absolute inset-0 bg-green-500/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="text-center text-white animate-bounce">
                           <div className="text-9xl mb-4">✨</div>
                           <h3 className="text-6xl font-black">EXCELLENT!</h3>
                        </div>
                     </div>
                   )}
                   {feedback === 'incorrect' && (
                     <div className="absolute inset-0 bg-red-500/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="text-center text-white">
                           <div className="text-9xl mb-4">⏰</div>
                           <h3 className="text-6xl font-black">TIME'S UP</h3>
                        </div>
                     </div>
                   )}
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">AI Assistant</h3>
                   <div className="text-center py-10">
                      <span className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-2">Detected gesture</span>
                      <span className="text-9xl font-black text-gray-900 block">{prediction?.letter || '?'}</span>
                      <div className="mt-6 flex items-center justify-center space-x-2">
                         <div className={`w-2 h-2 rounded-full ${isWsReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{isWsReady ? 'AI Engine Active' : 'AI Offline'}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                   <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Test Progress</h4>
                   <div className="flex gap-2">
                      {[...Array(TOTAL_QUESTIONS)].map((_, i) => (
                        <div key={i} className={`flex-1 h-2 rounded-full ${i < questionsAnswered ? 'bg-blue-600' : i === questionsAnswered ? 'bg-blue-300' : 'bg-blue-100'}`}></div>
                      ))}
                   </div>
                </div>

                {(wsError || webcamError) && (
                  <div className="text-[10px] font-black text-red-400 uppercase tracking-widest text-center">
                    Engine Status: {wsError || webcamError ? 'Issues Detected' : 'Optimal'}
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
