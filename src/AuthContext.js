import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import config from './config';
import useApi from './hooks/useApi';
import { getUserFromToken } from './utils/jwtUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get(config.jwt.key));
  const [isLocked, setIsLocked] = useState(false); // 추가된 상태
  const [functions, setFunctions] = useState([]);
  const functionsApi = useApi();
  // const logoutApi = useApi();

  useEffect(() => {
    const token = Cookies.get(config.jwt.key);
    if (token) {
      // JWT 토큰이 있을 경우 자동으로 로그인
      setIsAuthenticated(true);
      functionsApi.callApi(
        config.api.path.functions,
        config.api.method.GET
      );
    }
  }, []);

  useEffect(() => {
    setFunctions(functionsApi.data);
  }, [functionsApi.data]);

  const login = () => {
    setIsAuthenticated(true);
    functionsApi.callApi(
      config.api.path.functions,
      config.api.method.GET
    );
  };

  const logout = () => {
    // logoutApi.callApi(
    //   config.api.path.logout,
    //   config.api.method.POST,
    //   { email: getUserToken().email }
    // );

    Cookies.remove(config.jwt.key);
    setIsAuthenticated(false);
    setIsLocked(false); // 로그아웃 시 잠금 해제
  };

  const getUserToken = () => {
    const token = Cookies.get(config.jwt.key);
    return token ? getUserFromToken(token) : null;
  };

  const lock = () => setIsLocked(true); // 잠금 상태 설정
  const unlock = () => setIsLocked(false); // 잠금 해제

  return (
    <AuthContext.Provider
      value={{
        functions, isAuthenticated, isLocked, login, logout, getUserToken, lock, unlock
      }}>
      {children}
    </AuthContext.Provider>
  );
};
