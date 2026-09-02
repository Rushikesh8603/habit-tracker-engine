import { createContext, useState, useContext } from 'react';
import axios from 'axios';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Wrapper
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // The login function that Login.jsx will call
  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // The logout function
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to easily grab this data from any file
export const useAuth = () => useContext(AuthContext);