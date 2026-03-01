import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This is where child routes will be rendered */}
      </main>
      {/* Optional: Add a Footer component here later */}
    </div>
  );
};

export default Layout;
