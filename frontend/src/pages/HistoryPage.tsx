import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface TestHistory {
  id: number;
  score: number;
  total_correct: number;
  total_questions: number;
  wrong_letters: string; // JSON string
  created_at: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("Please login to view your history.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/tests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch test history.');
        const data: TestHistory[] = await response.json();
        // Sort by date descending
        setHistory(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-bold text-gray-500 uppercase tracking-widest text-xs">Loading history...</p>
    </div>
  );

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-2">Test History</h1>
            <p className="text-lg text-gray-500 font-medium">Review your past performances and track improvement.</p>
          </div>
          <Link to="/test" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95">
            Take New Test
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
            <p className="text-red-600 font-bold">{error}</p>
            <Link to="/login" className="mt-4 inline-block text-blue-600 font-bold hover:underline">Go to Login</Link>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">No tests yet!</h2>
            <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">Your journey starts here. Take your first proficiency test to see your results.</p>
            <Link to="/test" className="text-blue-600 font-black text-lg hover:underline">Start your first test →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((record) => {
              const wrongLettersArr = JSON.parse(record.wrong_letters || '[]');
              const date = new Date(record.created_at).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
              });

              return (
                <div key={record.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col md:flex-row gap-8 items-start md:items-center hover:border-blue-200 transition-colors">
                  {/* Score Circle */}
                  <div className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center shrink-0 shadow-inner ${getScoreColor(record.score)}`}>
                    <span className="text-3xl font-black">{(record.score * 100).toFixed(0)}%</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">Accuracy</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Test Session</span>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <span className="text-xs font-bold text-gray-400">{date}</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">
                      {record.total_correct} Correct <span className="text-gray-300 font-bold">/</span> {record.total_questions} Questions
                    </h3>
                    
                    {wrongLettersArr.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Need Review:</span>
                        {wrongLettersArr.map((letter: string, i: number) => (
                          <Link 
                            key={i} 
                            to={`/learn/${letter.toLowerCase()}`}
                            className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-black text-xs hover:bg-red-600 hover:text-white transition-colors border border-red-100"
                          >
                            {letter}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600 font-bold text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Perfect Score!
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex gap-3 w-full md:w-auto">
                    <Link 
                      to="/test" 
                      className="flex-1 md:flex-none text-center px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-black text-sm transition-colors"
                    >
                      Retry
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
