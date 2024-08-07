import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const NavbarComponent = () => {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // 테마에 따른 텍스트 색상 클래스 결정
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  // NavLink에 대해 동적으로 클래스 이름 설정 함수
  const getNavLinkClassName = (isActive) => {
    return `${textColorClass} nav-link ${isActive ? 'active' : ''}`;
  };

  return (
    <div className={`bg-${theme} sidebar ${isCollapsed ? '' : 'show'}`}>
      <div className="d-md-none d-flex justify-content-center">
        <Button variant={`outline-${theme === 'light' ? "dark" : "light"}`} className=" d-md-none" onClick={toggleCollapse}><i className="bi-list"></i></Button>
      </div>
      <Nav
        className={`d-md-block ${isCollapsed ? 'collapse' : 'collapse show'}`}
      >
        <div className="sidebar-sticky"></div>
        {/* 공백용 */}
        <Nav.Item className="mb-3"></Nav.Item>
        {/* 공백용 */}
        <Nav.Item className="mb-3">
          <NavLink to="/home" className={({ isActive }) => getNavLinkClassName(isActive)}>
            <i className="bi bi-house-fill"></i>
            <span className="nav-text">Home</span>
          </NavLink>
        </Nav.Item>
        <Nav.Item className="mb-3">
          <NavLink to="/dashboard" className={({ isActive }) => getNavLinkClassName(isActive)}>
            <i class="bi bi-speedometer"></i>
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </Nav.Item>
        <Nav.Item className="mb-3">
          <NavLink to="/logs" className={({ isActive }) => getNavLinkClassName(isActive)}>
            <i className="bi bi-file-earmark-post"></i>
            <span className="nav-text">Logs</span>
          </NavLink>
        </Nav.Item>
        <Nav.Item className="mb-3">
          <NavLink to="/users" className={({ isActive }) => getNavLinkClassName(isActive)}>
            <i className="bi bi-people-fill"></i>
            <span className="nav-text">Users</span>
          </NavLink>
        </Nav.Item>
        <Nav.Item className="mb-3">
          <NavLink to="/manage" className={({ isActive }) => getNavLinkClassName(isActive)}>
            <i className="bi bi-terminal-fill"></i>
            <span className="nav-text">Manage</span>
          </NavLink>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default NavbarComponent;
