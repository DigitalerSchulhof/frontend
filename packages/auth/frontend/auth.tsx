import Cookies from 'js-cookie';
import React, { createContext, useCallback, useContext, useState } from 'react';

export const useAuth = () => useContext(AuthContext);

export interface AuthContextType {
  isLoggedIn: boolean;
  jwt: string | null;
  setJWT: (jwt: string) => void;
}

export const AuthContext = createContext<AuthContextType>(null as any);

export const AuthContextProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [jwt, setJWTState] = useState<string | null>(
    Cookies.get('jwt') ?? null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(jwt !== null);

  const setJWT = useCallback((jwt: string): void => {
    setJWTState(jwt);
    Cookies.set('jwt', jwt);
    setIsLoggedIn(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, jwt, setJWT }}>
      {children}
    </AuthContext.Provider>
  );
};
