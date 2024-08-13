import React from 'react';
import { Alert } from 'react-bootstrap';
import { useTheme } from '../ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  return (
    <>
      <h1 className={`header-title ${textColorClass}`}>Home</h1>
      <p className={`header-description ${textColorClass}`}>Welcome to the ITEASY Service Ops Center Platform.</p>

      <Alert key="warning" variant="warning">
        현재 DB작업 중이므로 언제든지 DB 가 날라갈 수 있습니다 😇
      </Alert>
    </>
  );
};

export default Home;