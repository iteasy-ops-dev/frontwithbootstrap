import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Insight from './pages/Insight';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Users from './pages/Users';
import Manage from './pages/Manage';
// import Sentinel from './pages/SentinelOne';
import WebConsole from './pages/WebConsole';
import WorkMonitor from './pages/WorkMonitor';
import Roulette from './pages/Games';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import LockPage from './pages/LockPage';
import ResetPassword from './pages/ResetPassword';
import { ThemeProvider, useTheme } from './ThemeContext';
import { AuthProvider, useAuth } from './AuthContext';

// import './styles copy.css';
import './styles.css';

const ProtectedRoute = ({ element, redirectTo }) => {
  const { isAuthenticated, isLocked } = useAuth();

  if (isLocked) {
    return <Navigate to="/lock" />;
  }

  if (!isAuthenticated && redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return element;
};

const RedirectToHomeIfAuthenticated = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" /> : element;
};

const Main = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/reset-password', '/lock'].includes(location.pathname);
  const isNotFoundPage = location.pathname !== '/' && ![
    '/home',
    '/insight',
    '/dashboard',
    '/profile',
    '/logs',
    '/users',
    '/manage',
    // '/sentinel/setting',
    '/console',
    '/monitor',
    '/games',
    '/login',
    '/signup',
    '/reset-password',
  ].includes(location.pathname);

  return (
    <div className={`d-flex flex-column vh-100 bg-${theme}`}>
      {!isAuthPage && !isNotFoundPage && <Header />}
      <div className={`d-flex flex-grow-1 bg-${theme}`}>
        {!isAuthPage && !isNotFoundPage && <Navbar />}
        <div className={`main flex-grow-1 p-3 bg-${theme}`}>
          <Routes>
            <Route path="/home" element={<ProtectedRoute element={<Home />} redirectTo="/login" />} />
            <Route path="/insight" element={<ProtectedRoute element={<Insight />} redirectTo="/login" />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} redirectTo="/login" />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} redirectTo="/login" />} />
            <Route path="/logs" element={<ProtectedRoute element={<Logs />} redirectTo="/login" />} />
            <Route path="/users" element={<ProtectedRoute element={<Users />} redirectTo="/login" />} />
            <Route path="/manage" element={<ProtectedRoute element={<Manage />} redirectTo="/login" />} />
            {/* <Route path="/sentinel/setting" element={<ProtectedRoute element={<Sentinel />} redirectTo="/login" />} /> */}
            <Route path="/console" element={<ProtectedRoute element={<WebConsole />} redirectTo="/login" />} />
            <Route path="/monitor" element={<ProtectedRoute element={<WorkMonitor />} redirectTo="/login" />} />
            <Route path="/games" element={<ProtectedRoute element={<Roulette />} redirectTo="/login" />} />
            <Route path="/login" element={<RedirectToHomeIfAuthenticated element={<Login />} />} />
            <Route path="/signup" element={<RedirectToHomeIfAuthenticated element={<Signup />} />} />
            <Route path="/reset-password" element={<RedirectToHomeIfAuthenticated element={<ResetPassword />} />} />
            <Route path="/lock" element={<LockPage />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      {!isAuthPage && !isNotFoundPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;