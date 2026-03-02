import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import useWebcamAndHandDetection from '../hooks/useWebcamAndHandDetection';
import { usePredictionWebSocket } from '../hooks/usePredictionWebSocket';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const PracticePage = () => {
  const { letter } = useParams<{ letter: string }>();
  const [progressSaved, setProgressSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedConfidenceRef = useRef<number>(0); 

  const { prediction, wsError, isWsReady, sendLandmarks, setPrediction } = usePredictionWebSocket();

  const saveProgress = useCallback(async (currentLetter: string, confidence: number, isMastered: boolean) => {
    const token = localStorage.getItem('access_token');
    if (!token || isSaving) return;
    setIsSaving(true);
    try {
      await fetch(`${API_BASE_URL}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ letter: currentLetter, highest_confidence: confidence, is_mastered: isMastered })
      });
      setProgressSaved(true);
      lastSavedConfidenceRef.current = confidence;
    } catch (err) {
      console.error("Error saving progress:", err);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  useEffect(() => {
    if (prediction && letter && prediction.letter === letter.toUpperCase()) {
      if (prediction.confidence >= 0.6 && prediction.confidence > lastSavedConfidenceRef.current) {
        saveProgress(letter.toUpperCase(), prediction.confidence, prediction.confidence >= 0.8);
      }
    }
  }, [prediction, letter, saveProgress]);

  // Reset states when target letter changes
  useEffect(() => {
    setProgressSaved(false);
    lastSavedConfidenceRef.current = 0; 
    setPrediction(null); // Clear previous prediction
  }, [letter, setPrediction]);

  const onNewLandmarks = useCallback((handsData: any) => sendLandmarks(handsData), [sendLandmarks]);
  const { videoRef, canvasRef, isHandLandmarkerLoaded, startDetection, stopDetection, error: webcamError } = useWebcamAndHandDetection(onNewLandmarks, 150);

  useEffect(() => {
    if (isHandLandmarkerLoaded) startDetection();
    return () => stopDetection();
  }, [isHandLandmarkerLoaded, startDetection, stopDetection]);

  const displayLetter = letter ? letter.toUpperCase() : '';
  const isCorrect = prediction?.letter === displayLetter;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
           <div>
              <Link to="/learn" className="text-blue-600 font-black hover:text-blue-800 transition-colors mb-2 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Modules
              </Link>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">Practice: <span className="text-blue-600">{displayLetter}</span></h1>
           </div>
           
           <div className="flex items-center space-x-3">
              <div className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center ${isWsReady ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isWsReady ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
                {isWsReady ? 'AI Online' : 'Connecting AI...'}
              </div>
              <div className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center ${isHandLandmarkerLoaded ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isHandLandmarkerLoaded ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {isHandLandmarkerLoaded ? 'Camera Ready' : 'Loading Vision...'}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 relative aspect-video bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scaleX(-1)"></video>
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover transform scaleX(-1)"></canvas>
              {!isHandLandmarkerLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                   <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="font-black text-gray-500 uppercase tracking-widest text-xs">Initializing AI Vision...</p>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div className={`p-8 rounded-[2.5rem] transition-all duration-500 border ${isCorrect ? 'bg-green-500 border-green-600 shadow-xl shadow-green-100' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                 <h2 className={`text-xs font-black uppercase tracking-widest mb-8 ${isCorrect ? 'text-white/80' : 'text-gray-400'}`}>Live Analysis</h2>
                 {prediction ? (
                   <div className="space-y-6">
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isCorrect ? 'text-white/60' : 'text-gray-400'}`}>Current Gesture</span>
                        <span className={`text-8xl font-black block mt-1 ${isCorrect ? 'text-white' : 'text-gray-900'}`}>{prediction.letter}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isCorrect ? 'text-white/60' : 'text-gray-400'}`}>Accuracy</span>
                        <div className="flex items-center space-x-4 mt-2">
                           <div className={`flex-1 h-3 rounded-full overflow-hidden ${isCorrect ? 'bg-white/20' : 'bg-gray-100'}`}>
                              <div className={`h-full transition-all duration-300 ${isCorrect ? 'bg-white' : 'bg-blue-600'}`} style={{ width: `${prediction.confidence * 100}%` }}></div>
                           </div>
                           <span className={`font-black text-xl ${isCorrect ? 'text-white' : 'text-gray-900'}`}>{(prediction.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="py-12 text-center text-gray-400 font-bold text-sm leading-relaxed">
                      Position your hand in the view to see results.
                   </div>
                 )}
              </div>

              {isCorrect && prediction.confidence >= 0.8 && (
                <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-200 flex items-center justify-between group">
                   <div>
                     <h3 className="text-2xl font-black text-white">Perfect Form!</h3>
                     <p className="text-blue-100 font-bold text-sm">Mastery achieved for {displayLetter}</p>
                   </div>
                   <div className="text-4xl animate-bounce">🌟</div>
                </div>
              )}

              {progressSaved && (
                <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center font-black text-green-600 text-xs uppercase tracking-widest">
                   Progress Saved Successfully
                </div>
              )}

              {(wsError || webcamError) && (
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
                   Error: {wsError || webcamError}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
