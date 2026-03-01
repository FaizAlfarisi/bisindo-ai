import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">BISINDO Learning</Link>
        <div className="space-x-4">
          <Link to="/learn" className="hover:text-gray-300">Learn</Link>
          <Link to="/test" className="hover:text-gray-300">Test</Link>
          <Link to="/history" className="hover:text-gray-300">History</Link>
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded">Login</Link>
          <Link to="/register" className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
