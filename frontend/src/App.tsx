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

// Layout component (to be created next)
import Layout from './components/Layout'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> {/* Layout will contain Navbar and Outlet */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/:letter" element={<LearnDetailPage />} />
        <Route path="practice/:letter" element={<PracticePage />} />
        <Route path="test" element={<TestPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;