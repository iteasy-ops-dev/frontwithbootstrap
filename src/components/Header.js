import React from 'react';
import { useTheme } from '../ThemeContext';
import { Navbar, Nav, Button } from 'react-bootstrap';
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

  return (
    <Navbar bg={`${theme}`} variant={`${theme}`} className="header justify-content-between">
      <Navbar.Brand>ITEASY Ops Dev</Navbar.Brand>
      {isAuthenticated && (
        <>
          <Nav>
            <Nav.Item className={`text-${theme === "dark" ? "light" : "dark"}`}>
            <i class="bi bi-person-circle"></i> {getUserEmail()}
            </Nav.Item>
          </Nav>
          <Button variant={`outline-${theme === "dark" ? "light" : "dark"}`} onClick={handleLogout}><i class="bi bi-escape"></i> Logout</Button>
        </>
      )}
    </Navbar>
  );
};

export default Header;
