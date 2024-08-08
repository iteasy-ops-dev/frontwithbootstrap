// import React from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import Logs from './pages/Logs';
// import Users from './pages/Users';
// import Manage from './pages/Manage';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Profile from './pages/Profile';
// import NotFound from './pages/NotFound';
// import LockPage from './pages/LockPage';
// import ResetPassword from './pages/ResetPassword';
// import { ThemeProvider } from './ThemeContext';
// import { AuthProvider, useAuth } from './AuthContext';

// import './styles.css';

// // ProtectedRoute component to handle redirection based on authentication
// const ProtectedRoute = ({ element, redirectTo }) => {
//   const { isAuthenticated } = useAuth();
  
//   if (!isAuthenticated && redirectTo) {
//     return <Navigate to={redirectTo} />;
//   }
  
//   return element;
// };

// function App() {
//   const location = useLocation();
//   const isAuthPage = ['/login', '/signup', '/reset-password', '/lock'].includes(location.pathname);
//   const isNotFoundPage = location.pathname !== '/' && ![
//     '/home', 
//     '/dashboard', 
//     '/profile', 
//     '/logs', 
//     '/users', 
//     '/manage', 
//     '/login', 
//     '/signup', 
//     '/reset-password',
//   ].includes(location.pathname);

//   return (
//     <AuthProvider>
//       <ThemeProvider>
//         <div className="d-flex flex-column vh-100">
//           {!isAuthPage && !isNotFoundPage && <Header />}
//           <div className="d-flex flex-grow-1">
//             {!isAuthPage && !isNotFoundPage && <Navbar />}
//             <div className={`main flex-grow-1 p-3`}>
//               <Routes>
//                 <Route path="/home" element={<ProtectedRoute element={<Home />} redirectTo="/login" />} />
//                 <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} redirectTo="/login" />} />
//                 <Route path="/profile" element={<ProtectedRoute element={<Profile />} redirectTo="/login" />} />
//                 <Route path="/logs" element={<ProtectedRoute element={<Logs />} redirectTo="/login" />} />
//                 <Route path="/users" element={<ProtectedRoute element={<Users />} redirectTo="/login" />} />
//                 <Route path="/manage" element={<ProtectedRoute element={<Manage />} redirectTo="/login" />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/signup" element={<Signup />} />
//                 <Route path="/reset-password" element={<ResetPassword />} />
//                 <Route path="/lock" element={<LockPage />} /> {/* 잠금 페이지 라우트 추가 */}
//                 <Route path="/" element={<Navigate to="/home" />} />
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </div>
//           </div>
//           {!isAuthPage && !isNotFoundPage && <Footer />}
//         </div>
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }

// export default App;


// App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Users from './pages/Users';
import Manage from './pages/Manage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import LockPage from './pages/LockPage';
import ResetPassword from './pages/ResetPassword';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider, useAuth } from './AuthContext';

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

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/reset-password', '/lock'].includes(location.pathname);
  const isNotFoundPage = location.pathname !== '/' && ![
    '/home', 
    '/dashboard', 
    '/profile', 
    '/logs', 
    '/users', 
    '/manage', 
    '/login', 
    '/signup', 
    '/reset-password',
  ].includes(location.pathname);

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="d-flex flex-column vh-100">
          {!isAuthPage && !isNotFoundPage && <Header />}
          <div className="d-flex flex-grow-1">
            {!isAuthPage && !isNotFoundPage && <Navbar />}
            <div className={`main flex-grow-1 p-3`}>
              <Routes>
                <Route path="/home" element={<ProtectedRoute element={<Home />} redirectTo="/login" />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} redirectTo="/login" />} />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} redirectTo="/login" />} />
                <Route path="/logs" element={<ProtectedRoute element={<Logs />} redirectTo="/login" />} />
                <Route path="/users" element={<ProtectedRoute element={<Users />} redirectTo="/login" />} />
                <Route path="/manage" element={<ProtectedRoute element={<Manage />} redirectTo="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/lock" element={<LockPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
          {!isAuthPage && !isNotFoundPage && <Footer />}
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
