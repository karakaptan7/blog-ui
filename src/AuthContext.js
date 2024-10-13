import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("isAuthenticated state changed:", isAuthenticated);
  }, [isAuthenticated]);

  const login = async () => {
    console.log("Login function called");
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("Logout function called");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
