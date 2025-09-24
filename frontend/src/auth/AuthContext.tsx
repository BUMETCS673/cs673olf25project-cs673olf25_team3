/*

AI-generated: 80% (Tool: ChatGPT, Cursor mainly boilerplate for AuthContext, token refresh logic, useEffect timers)
Human-written: 20% (functions: fetchProfile, isTokenExpired adjustments, logout redirect, minor modifications for project needs)

Notes:
- Most core AuthContext setup, token handling, and fetch wrappers were AI-assisted.
- Human contributions: specific business logic, error handling, logout navigation, user state updates.

*/
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number | string;
  username: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType {
  auth: AuthState;
  user: User | null;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext<AuthContextType>({
  auth: { accessToken: null, refreshToken: null },
  user: null,
  login: () => {},
  logout: () => {},
  refreshAccessToken: async () => null,
  authFetch: async () => {
    throw new Error("authFetch not initialized");
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState>({ accessToken: null, refreshToken: null });
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (access || refresh) {
      setAuth({
        accessToken: access ?? null,
        refreshToken: refresh ?? null,
      });
    }
  }, []);

  const login = (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setAuth({ accessToken: access, refreshToken: refresh });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuth({ accessToken: null, refreshToken: null });
    setUser(null);
    navigate("/login");
  };

  const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() / 1000 > payload.exp;
    } catch {
      return true;
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!auth.refreshToken || isTokenExpired(auth.refreshToken)) {
      logout();
      return null;
    }

    try {
      const res = await fetch(`${baseUrl}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: auth.refreshToken }),
      });

      const data = await res.json();

      if (res.ok && data.access) {
        login(data.access, auth.refreshToken); // keep refresh token
        return data.access;
      } else {
        logout();
        return null;
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }
  };

  useEffect(() => {
    if (!auth.accessToken) return;

    let timer: ReturnType<typeof setTimeout>;
    try {
      const payload = JSON.parse(atob(auth.accessToken.split(".")[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();

      const timeout = expiresAt - now - 60_000;

      if (timeout <= 0) {
        refreshAccessToken();
      } else {
        timer = setTimeout(() => {
          refreshAccessToken();
        }, timeout);
      }
    } catch (e) {
      console.error("Error parsing token payload", e);
    }

    return () => clearTimeout(timer);
  }, [auth.accessToken, auth.refreshToken]);

  const authFetch = async (url: string, options: RequestInit = {}) => {
    let access = auth.accessToken;

    if (isTokenExpired(access)) {
      access = await refreshAccessToken();
      if (!access) throw new Error("Session expired");
    }

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
      },
    });
  };


  const fetchProfile = async () => {
    if (!auth.accessToken) {
      setUser(null);
      return;
    }

    try {
      const res = await authFetch(`${baseUrl}/api/profile/`);
      if (res.ok) {
        const data: User = await res.json();
        setUser(data);
      } else {
        setUser(null);
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [auth.accessToken]);

  return (
    <AuthContext.Provider value={{ auth, user, login, logout, refreshAccessToken, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
