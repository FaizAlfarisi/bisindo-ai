import { Routes, Route } from 'react-router-dom';

// Import all page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import LearnDetailPage from './pages/LearnDetailPage';
import PracticePage from './pages/PracticePage';
import TestPage from './pages/TestPage';
import HistoryPage from './pages/HistoryPage';

// Layout component
import Layout from './components/Layout'; 
// AuthGuard component
import AuthGuard from './components/AuthGuard'; // Added AuthGuard import

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> {/* Layout will contain Navbar and Outlet */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<AuthGuard />}> {/* Wrap protected routes with AuthGuard */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/:letter" element={<LearnDetailPage />} />
          <Route path="practice/:letter" element={<PracticePage />} />
          <Route path="test" element={<TestPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Route>
      {/* Optionally add a 404 Not Found page */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
