import React from 'react';
import { useTheme } from '../ThemeContext';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { theme } = useTheme();
  const { isAuthenticated, logout, getUserEmail } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    logout(); // Log out the user
    navigate('/login'); // Redirect to login page
  };

  const handleProfile = () => {
    navigate('/profile'); // Navigate to profile edit page
  };

  return (
    <Navbar bg={theme} variant={theme} className="header justify-content-between">
      <Navbar.Brand>ITEASY Service Ops</Navbar.Brand>
      {isAuthenticated && (
        <Dropdown align="end">
          <Dropdown.Toggle variant={`outline-${theme === "dark" ? "light" : "dark"}`} id="dropdown-basic">
            {getUserEmail()}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleProfile}><i className="bi bi-person-circle"></i>  Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}><i class="bi bi-power"></i> Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Navbar>
  );
};

export default Header;
