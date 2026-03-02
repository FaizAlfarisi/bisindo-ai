import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registrationSuccess')) {
      setSuccessMsg("Registration successful! Please log in.");
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed.');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError("Cannot connect to server. Please check your internet or API URL.");
      } else {
        setError(err.message || 'Incorrect username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-gray-100 w-full max-w-xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
            <span className="text-white font-black text-3xl">B</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Continue your BISINDO mastery journey.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {successMsg && (
            <div className="bg-green-50 border border-green-100 p-4 rounded-2xl text-green-600 text-sm font-bold text-center">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Username</label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 font-bold text-sm">
            New here? <Link to="/register" className="text-indigo-600 hover:underline ml-1">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
