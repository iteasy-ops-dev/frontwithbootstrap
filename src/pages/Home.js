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
        <strong>정기 업데이트:</strong> 매 영업일 08시
        <br/>
        <br/>
        <strong>수시 업데이트:</strong> 치명적 결함 발견 시
        <br/>
        <br/>
        작업의뢰 시 발견되는 에러는 반드시 바로 말씀해주세요!
      </Alert>
    </>
  );
};

export default Home;