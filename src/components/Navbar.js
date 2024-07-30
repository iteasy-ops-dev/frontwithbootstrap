import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const NavbarComponent = () => {
  const { theme } = useTheme();

  // Determine text color based on theme
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  // Function to dynamically set className for NavLink
  const getNavLinkClassName = (isActive) => {
    return `${textColorClass} nav-link ${isActive ? 'active' : ''}`;
  };

  return (
    <Nav className={`col-md-2 d-none d-md-block bg-${theme} sidebar`}>
      <div className="sidebar-sticky"></div>
      <Nav.Item className="mb-3">
        <NavLink to="/home" className={({ isActive }) => getNavLinkClassName(isActive)}><i class="bi bi-house-fill"></i> Home</NavLink>
      </Nav.Item>
      <Nav.Item className="mb-3">
        <NavLink to="/log" className={({ isActive }) => getNavLinkClassName(isActive)}><i class="bi bi-file-earmark-post"></i> Log</NavLink>
      </Nav.Item>
      <Nav.Item className="mb-3">
        <NavLink to="/user" className={({ isActive }) => getNavLinkClassName(isActive)}><i class="bi bi-people-fill"></i> User</NavLink>
      </Nav.Item>
      <Nav.Item className="mb-3">
        <NavLink to="/manage" className={({ isActive }) => getNavLinkClassName(isActive)}><i class="bi bi-terminal-fill"></i> Manage</NavLink>
      </Nav.Item>
    </Nav>
  );
};

export default NavbarComponent;