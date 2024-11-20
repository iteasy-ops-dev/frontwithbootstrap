import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { NewBadge, UpdateBadge } from './Badges';

const NavbarComponent = () => {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSentinelOpen, setIsSentinelOpen] = useState(false); // Sentinel 확장 여부 상태

  // 사이드바 열고 닫기 토글 함수
  const toggleCollapse = () => setIsCollapsed(!isCollapsed); // Sentinel 메뉴 토글 함수

  // const toggleSentinel = () => setIsSentinelOpen(!isSentinelOpen);

  // 테마에 따른 텍스트 색상 클래스 결정 함수
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  // NavLink 항목을 생성하는 함수
  const renderNavLink = (to, iconClass, text, BadgeComponent = null) => {
    return (
      <>
        <Nav.Item className="mb-3">
          <NavLink to={to} className={({ isActive }) => `${textColorClass} nav-link ${isActive ? 'active' : ''}`}>
            <i className={`bi ${iconClass}`}></i>{' '}
            <span className="nav-text">{text}</span>
            {BadgeComponent && <BadgeComponent />} {/* 뱃지가 있으면 렌더링 */}
          </NavLink>
        </Nav.Item>
      </>
    );
  };

  // const renderSubNavLink = (to, text, BadgeComponent = null) => {
  //   return (
  //     <Nav.Item className="mb-3">
  //       <NavLink to={to} className={({ isActive }) => `${textColorClass} nav-link ${isActive ? 'active' : ''}`}>
  //         <span className="nav-sub-text">{text}</span>
  //         {BadgeComponent && <BadgeComponent />} {/* 뱃지가 있으면 렌더링 */}
  //       </NavLink>
  //     </Nav.Item>
  //   );
  // };

  // Sentinel 하위 메뉴 렌더링
  // const renderSentinelSubMenu = () => {
  //   if (!isSentinelOpen) return null; // Sentinel 메뉴가 열리지 않으면 렌더링하지 않음

  //   return (
  //     <>
  //       {renderSubNavLink('/test1', 'test1')}
  //       {renderSubNavLink('/test1', 'test2')}
  //       {renderSubNavLink('/test1', 'test3')}
  //       {renderSubNavLink('/sentinel/setting', 'setting')}
  //     </>
  //   );
  // };

  return (
    <div className={`bg-${theme} sidebar ${isCollapsed ? '' : 'show'}`}>
      <div className="d-md-none d-flex justify-content-center">
        {/* 모바일 화면에서 사이드바 토글 버튼 */}
        <Button variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} className="d-md-none" onClick={toggleCollapse}>
          <i className="bi-list"></i>
        </Button>
      </div>
      <Nav className={`navbar-brand d-md-block ${isCollapsed ? 'collapse' : 'collapse show'}`}>
        <Nav.Item className="mb-3" style={{ paddingLeft: "20px" }}>
          <img
            alt=""
            height="23px"
            width="140px"
            src="/logo_iteasy.png"
          />
          <br />
          <span className='navbar-brand-text'>Service Ops Center</span>
        </Nav.Item>
        <br />
        <br />
        {/* 각 NavLink 항목을 함수 호출로 처리 */}
        {renderNavLink('/home', 'bi-house', 'Home')}
        {renderNavLink('/insight', 'bi-lightbulb', 'Insight')}
        {renderNavLink('/dashboard', 'bi-speedometer', 'Dashboard')}
        {renderNavLink('/logs', 'bi-file-text', 'Logs')}
        {renderNavLink('/users', 'bi-people', 'Users')}
        {renderNavLink('/manage', 'bi-person-workspace', 'Manage', UpdateBadge)}
        {/* {renderNavLink('', 'bi bi-shield', 'Sentinel', NewBadge, renderSentinelSubMenu)} */}
        {/* <Nav.Item className="mb-3">
          <div
            className={`${textColorClass} nav-link`}
            onClick={toggleSentinel}
          >
            <i className="bi bi-shield"></i>{' '}
            <span className="nav-text">Sentinel</span>
            <i className="bi bi-chevron-down"></i>
            <NewBadge />
          </div>
          {renderSentinelSubMenu()}
        </Nav.Item> */}
        {renderNavLink('/console', 'bi-terminal', 'Console')}
        {renderNavLink('/workboard', 'bi-display', 'Workboard')}
        {renderNavLink('/monitor', 'bi-display', 'Monitor', NewBadge)}
        {renderNavLink('/games', 'bi-controller', 'Roulette')}
      </Nav>
    </div>
  );
};

export default NavbarComponent;
