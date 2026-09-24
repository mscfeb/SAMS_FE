import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as loginRequest } from "../api/auth.api.js";
import { clearToken, getToken, setToken } from "./auth-storage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        setUser(await getMe());
      } catch (_error) {
        clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
  }, []);

  async function login(role) {
    const result = await loginRequest(role);
    setToken(result.token);
    setUser(await getMe());
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = {
    user,
    token: getToken(),
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
