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
        시범운영 기간 동안 수시 업데이트되므로 에러가 발생할 수 있습니다.
        <br/>
        그럴 경우, 1~3분 정도 기다리시면 정상적으로 작동합니다.
        <br/>
        <br/>
        해당 플랫폼으로 작업의뢰를 진행중이시라면 반드시 말씀해주세요!
        <br/>
        <br/>
        현재 시범운영 중이므로 언제든지 <strong>DB</strong>가 초기화 될 수 있습니다 😇
      </Alert>
    </>
  );
};

export default Home;