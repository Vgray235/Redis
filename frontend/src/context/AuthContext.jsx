import React, { createContext, useContext, useEffect, useState } from "react";
import { getSession, login as apiLogin, register as apiRegister, logout as apiLogout } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSession();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (creds) => {
    const data = await apiLogin(creds);
    if (data.user) setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await apiRegister(payload);
    if (data.user) setUser(data.user);
    return data;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);