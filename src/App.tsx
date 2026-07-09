import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login/index';
import Portfolio from './pages/Dashboard/index';
import AccountsPage from './pages/AccountsPage';
import AccountOverviewPage from './pages/AccountOverviewPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import Settings from './pages/Settings/index';
import './index.css';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const routerBase =
    import.meta.env.BASE_URL === '/'
      ? '/'
      : import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <BrowserRouter basename={routerBase}>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Protected><Layout><Portfolio /></Layout></Protected>} />
            <Route path="/accounts" element={<Protected><Layout><AccountsPage /></Layout></Protected>} />
            <Route path="/accounts/:accountId" element={<Protected><Layout><AccountOverviewPage /></Layout></Protected>} />
            <Route path="/accounts/:accountId/opportunities/:opportunityId" element={<Protected><Layout><OpportunityDetailPage /></Layout></Protected>} />
            <Route path="/accounts/:accountId/opportunity/:opportunityId" element={<Protected><Layout><OpportunityDetailPage /></Layout></Protected>} />
            <Route path="/settings" element={<Protected><Layout><Settings /></Layout></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
