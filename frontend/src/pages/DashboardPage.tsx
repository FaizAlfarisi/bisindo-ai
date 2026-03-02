import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface UserProgress {
  letter: string;
  highest_confidence: number;
  is_mastered: boolean;
}

interface TestHistory {
  score: number;
  total_correct: number;
  total_questions: number;
  wrong_letters: string;
  created_at: string;
}

const DashboardPage = () => {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const [progressRes, testsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/progress`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/tests`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!progressRes.ok || !testsRes.ok) throw new Error('Failed to fetch dashboard data.');
        
        setUserProgress(await progressRes.json());
        const tests = await testsRes.json();
        setTestHistory(tests.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const masteredLetters = userProgress.filter(p => p.is_mastered).map(p => p.letter).sort();
  const latestTest = testHistory.length > 0 ? testHistory[0] : null;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-bold text-gray-500 uppercase tracking-widest text-xs">Syncing data...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Sync Error</h2>
        <p className="text-gray-500 font-medium mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-12">
           <h1 className="text-5xl font-black text-gray-900 mb-2">My Dashboard</h1>
           <p className="text-lg text-gray-500 font-medium">Your progress and learning journey at a glance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Progress Card */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Mastery Level</h2>
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                   <span className="text-5xl font-black text-blue-600">{masteredLetters.length} <span className="text-2xl text-gray-300 font-bold">/ 26</span></span>
                   <span className="text-lg font-bold text-gray-500 uppercase tracking-widest">{Math.round((masteredLetters.length / 26) * 100)}% Complete</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(masteredLetters.length / 26) * 100}%` }}></div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {masteredLetters.length > 0 ? masteredLetters.map(letter => (
                  <div key={letter} className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm">
                    {letter}
                  </div>
                )) : (
                  <p className="text-gray-400 font-medium">You haven't mastered any letters yet. Let's start!</p>
                )}
              </div>
            </div>
            
            <Link to="/learn" className="mt-10 inline-flex items-center text-blue-600 font-black text-lg hover:translate-x-2 transition-transform">
              Continue Learning 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Latest Test Card */}
          <div className="bg-indigo-900 text-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100 border border-indigo-800 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
             
             <div className="relative z-10">
               <h2 className="text-3xl font-black mb-8">Latest Test</h2>
               {latestTest ? (
                 <div className="space-y-6">
                    <div>
                      <span className="text-6xl font-black block">{(latestTest.score * 100).toFixed(0)}%</span>
                      <span className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Overall Accuracy</span>
                    </div>
                    <div className="flex space-x-8">
                       <div>
                         <span className="text-2xl font-black block">{latestTest.total_correct}</span>
                         <span className="text-indigo-400 text-xs uppercase font-bold tracking-widest">Correct</span>
                       </div>
                       <div>
                         <span className="text-2xl font-black block">{latestTest.total_questions}</span>
                         <span className="text-indigo-400 text-xs uppercase font-bold tracking-widest">Total</span>
                       </div>
                    </div>
                 </div>
               ) : (
                 <p className="text-indigo-300 font-medium">No test history found. Prove your skills now!</p>
               )}
             </div>

             <Link to="/test" className="relative z-10 mt-10 bg-white text-indigo-900 py-4 px-6 rounded-2xl font-black text-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                Take New Test
             </Link>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/history" className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between group">
             <div>
               <h3 className="text-xl font-black text-gray-900 mb-1">Full History</h3>
               <p className="text-gray-500 font-medium">Review all your test results.</p>
             </div>
             <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
          </Link>
          
          <Link to="/learn" className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between group">
             <div>
               <h3 className="text-xl font-black text-gray-900 mb-1">Modules</h3>
               <p className="text-gray-500 font-medium">Browse A-Z abjad guides.</p>
             </div>
             <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
             </div>
          </Link>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-3xl shadow-lg flex items-center justify-between">
             <div>
               <h3 className="text-xl font-black text-white mb-1">Stay Sharp</h3>
               <p className="text-blue-100 font-medium">Daily practice is key.</p>
             </div>
             <div className="text-3xl">🔥</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
