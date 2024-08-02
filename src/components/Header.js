// 만료시간되면 자동 로그아웃 버전
import React, { useEffect, useState } from 'react';
import config from '../config';
import useApi from '../hooks/useApi';
import { useTheme } from '../ThemeContext';
import { Navbar, Dropdown } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { theme } = useTheme();
  const { isAuthenticated, logout, getUserToken } = useAuth();
  const { data, loading, error, callApi } = useApi();
  const navigate = useNavigate(); // Hook for navigation

  const [expirationTime, setExpirationTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const token = getUserToken();
    if (token && token.exp) {
      setExpirationTime(token.exp);
    }
  }, [data]);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (expirationTime) {
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const remainingTime = expirationTime - now;
        if (remainingTime > 0) {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('Expired');
          alert("토큰이 만료되었습니다. 다시 로그인해주세요.")
          logout(); // Automatically log out the user when the token expires
          navigate('/login'); // Redirect to login page
        }
      }
    };

    updateRemainingTime(); // Initial update

    const intervalId = setInterval(updateRemainingTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [expirationTime, logout, navigate]);

  const handleLogout = () => {
    logout(); // Log out the user
    navigate('/login'); // Redirect to login page
  };

  const handleProfile = () => {
    navigate('/profile'); // Navigate to profile edit page
  };

  const handleExpirationExtension = () => {
    callApi(
      config.api.path.extend_extension, 
      config.api.method.GET
    );
  };

  return (
    <Navbar bg={theme} variant={theme} className="header justify-content-between">
      <Navbar.Brand>
        <img
          alt=""
          height="20px"
          width="120px"
          src="/logo_iteasy.png"
        />{' '}
        Service Ops
      </Navbar.Brand>
      {isAuthenticated && (
        <Dropdown align="end">
          <Dropdown.Toggle variant={`outline-${theme === "dark" ? "light" : "dark"}`} id="dropdown-basic">
            {getUserToken().email}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleProfile}><i className="bi bi-person-circle"></i> Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleExpirationExtension}><i class="bi bi-hourglass-split"></i> {timeLeft}</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}><i className="bi bi-power"></i> Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Navbar>
  );
};

export default Header;
