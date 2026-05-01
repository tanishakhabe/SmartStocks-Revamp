import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState('');

  const login = useCallback((name) => {
    setUsername(name || 'Investor');
  }, []);

  const logout = useCallback(() => {
    setUsername('');
  }, []);

  const value = useMemo(
    () => ({
      username,
      isAuthenticated: Boolean(username),
      login,
      logout,
    }),
    [username, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
