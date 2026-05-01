import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import PortfolioSimulatorPage from './pages/PortfolioSimulatorPage';
import RegisterPage from './pages/RegisterPage';
import SectorAnalysisPage from './pages/SectorAnalysisPage';
import StockDetailPage from './pages/StockDetailPage';
import WatchlistPage from './pages/WatchlistPage';

function AuthShell() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-zinc-900">
      <Sidebar />
      <main className="min-h-screen pt-16 md:pl-64 md:pt-8">
        <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <LoginPage
      onLogin={(email) => {
        const handle = String(email || '')
          .split('@')[0]
          .trim();
        login(handle || 'Investor');
        navigate('/onboarding');
      }}
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route element={<AuthShell />}>
        {/* Toggle DashboardPage `isLoading` to preview skeleton placeholders */}
        <Route path="/dashboard" element={<DashboardPage isLoading={false} />} />
        <Route path="/stock/:ticker" element={<StockDetailPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/sectors" element={<SectorAnalysisPage />} />
        <Route path="/portfolio" element={<PortfolioSimulatorPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
