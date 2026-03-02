import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

interface UserProgress {
  letter: string;
  is_mastered: boolean;
  highest_confidence: number;
}

const LearnPage = () => {
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data: UserProgress[] = await response.json();
          const progressMap = data.reduce((acc, curr) => {
            acc[curr.letter] = curr;
            return acc;
          }, {} as Record<string, UserProgress>);
          setProgress(progressMap);
        }
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Learn BISINDO</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Track your progress as you master the alphabet. Green cards indicate letters you've successfully practiced!
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-6">
          {ALL_LETTERS.map((letter) => {
            const letterProgress = progress[letter];
            const isMastered = letterProgress?.is_mastered;
            const hasTried = letterProgress && letterProgress.highest_confidence > 0;

            return (
              <Link
                key={letter}
                to={`/learn/${letter.toLowerCase()}`}
                className={`group relative border rounded-3xl p-8 flex items-center justify-center transition-all hover:-translate-y-2 active:scale-90 shadow-sm hover:shadow-2xl ${
                  isMastered 
                    ? 'bg-green-500 border-green-600 shadow-green-100' 
                    : hasTried 
                      ? 'bg-yellow-400 border-yellow-500 shadow-yellow-100'
                      : 'bg-white border-gray-100 hover:shadow-blue-100'
                }`}
              >
                <span className={`text-5xl font-black transition-colors ${
                  isMastered || hasTried ? 'text-white' : 'text-gray-800 group-hover:text-blue-600'
                }`}>
                  {letter}
                </span>
                
                {/* Status Indicator */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                  isMastered ? 'bg-white' : hasTried ? 'bg-white/60' : 'bg-blue-100 group-hover:bg-blue-500'
                }`}></div>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 bg-white border border-gray-100 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between shadow-xl">
           <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Ready to test your skills?</h2>
              <p className="text-gray-500 font-medium">Challenge yourself with a timed test once you feel confident.</p>
           </div>
           <Link to="/test" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">
              Take the Test
           </Link>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
