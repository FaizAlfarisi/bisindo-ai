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
  wrong_letters: string; // JSON string
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
        // Fetch User Progress
        const progressResponse = await fetch(`${API_BASE_URL}/api/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!progressResponse.ok) {
          const errData = await progressResponse.json();
          throw new Error(errData.detail || 'Failed to fetch user progress.');
        }
        const progressData: UserProgress[] = await progressResponse.json();
        setUserProgress(progressData);

        // Fetch Test History
        const testHistoryResponse = await fetch(`${API_BASE_URL}/api/tests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!testHistoryResponse.ok) {
          const errData = await testHistoryResponse.json();
          throw new Error(errData.detail || 'Failed to fetch test history.');
        }
        const testHistoryData: TestHistory[] = await testHistoryResponse.json();
        setTestHistory(testHistoryData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())); // Sort by newest
        
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred while fetching data.");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const masteredLetters = userProgress.filter(p => p.is_mastered).map(p => p.letter).sort();
  const latestTest = testHistory.length > 0 ? testHistory[0] : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <p className="text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-red-500">
        <p className="text-xl">Error: {error}</p>
        <Link to="/login" className="mt-4 text-blue-500 hover:underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-6">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
        {/* Mastered Letters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Mastered Letters ({masteredLetters.length} / 26)</h2>
          {masteredLetters.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {masteredLetters.map(letter => (
                <span key={letter} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-lg font-medium">
                  {letter}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No letters mastered yet. Start learning!</p>
          )}
          <Link to="/learn" className="block mt-4 text-blue-500 hover:underline">Go to Learn</Link>
        </div>

        {/* Latest Test Score Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Latest Test Score</h2>
          {latestTest ? (
            <div>
              <p className="text-xl mb-2">Score: <span className="font-bold">{(latestTest.score * 100).toFixed(2)}%</span> ({latestTest.total_correct}/{latestTest.total_questions})</p>
              <p className="text-gray-600 mb-2">Completed on: {new Date(latestTest.created_at).toLocaleDateString()}</p>
              {JSON.parse(latestTest.wrong_letters).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Letters to Review:</h3>
                  <p>{JSON.parse(latestTest.wrong_letters).join(', ')}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No test history available. Take a test!</p>
          )}
          <Link to="/test" className="block mt-4 text-blue-500 hover:underline">Go to Test</Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/learn" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">
            Start Learning
          </Link>
          <Link to="/test" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg">
            Take a Test
          </Link>
          <Link to="/history" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">
            View Test History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;