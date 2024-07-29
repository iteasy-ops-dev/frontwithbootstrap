import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Log from './pages/Log';
import User from './pages/User';
import Manage from './pages/Manage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider, useAuth } from './AuthContext';

import './styles.css';

// ProtectedRoute component to handle redirection based on authentication
const ProtectedRoute = ({ element, redirectTo }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated && redirectTo) {
    return <Navigate to={redirectTo} />;
  }
  
  return element;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="d-flex flex-column vh-100">
          <Header />
          <div className="d-flex flex-grow-1">
            <Navbar />

            <div className={`main flex-grow-1 p-3`}>
              <Routes>
                <Route path="/home" element={<ProtectedRoute element={<Home />} redirectTo="/login" />} />
                <Route path="/log" element={<ProtectedRoute element={<Log />} redirectTo="/login" />} />
                <Route path="/user" element={<ProtectedRoute element={<User />} redirectTo="/login" />} />
                <Route path="/manage" element={<ProtectedRoute element={<Manage />} redirectTo="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Navigate to="/home" />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
