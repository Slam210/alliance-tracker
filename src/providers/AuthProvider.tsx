"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as authService from "../services/auth";
import { LoginPayload, SignupPayload } from "../types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await authService.getCurrentUser();

      setAuthenticated(data.authenticated);
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      await authService.login(payload);

      await refresh();
    },
    [refresh],
  );

  const signup = useCallback(
    async (payload: SignupPayload) => {
      await authService.signup(payload);

      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();

      await refresh();
    } finally {
      setAuthenticated(false);
    }
  }, [refresh]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        authenticated,
        refresh,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
