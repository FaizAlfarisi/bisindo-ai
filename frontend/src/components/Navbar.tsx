import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useState, useEffect } from 'react'; // Added useState, useEffect

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status on component mount and when localStorage changes
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    // Optional: Add an event listener for storage changes if multiple tabs are open
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('access_token');
      setIsLoggedIn(!!updatedToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">BISINDO Learning</Link>
        <div className="space-x-4">
          <Link to="/learn" className="hover:text-gray-300">Learn</Link>
          <Link to="/test" className="hover:text-gray-300">Test</Link>
          <Link to="/history" className="hover:text-gray-300">History</Link>
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;