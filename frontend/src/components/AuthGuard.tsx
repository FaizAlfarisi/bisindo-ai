import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthGuard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default AuthGuard;
