import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Install this library via npm or yarn
import config from './config'
import useApi from './hooks/useApi';
import { getUserFromToken } from './utils/jwtUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get(config.jwt.key));
  const [functions, setFunctions] = useState([]);
  const { data, callApi } = useApi();

  useEffect(() => {
    setFunctions(data)
  }, [data]);

  const login = () => {
    setIsAuthenticated(true);
    callApi(
      config.api.path.functions,
      config.api.method.GET
    );
  };

  const logout = () => {
    Cookies.remove(config.jwt.key);
    setIsAuthenticated(false);
  };

  const getUserToken = () => {
    const token = Cookies.get(config.jwt.key);
    return token ? getUserFromToken(token) : null;
  };

  return (
    <AuthContext.Provider
      value={{
        functions, isAuthenticated, login, logout, getUserToken
      }}>
      {children}
    </AuthContext.Provider>
  );
};
