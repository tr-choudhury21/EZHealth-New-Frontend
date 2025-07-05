import { createContext, useState } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  userRole: null,
  setIsAuthenticated: () => {},
  setUser: () => {},
  setUserRole: () => {},
});

export const AppWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        userRole,
        setUserRole,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
