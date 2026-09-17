import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { apiPost } from '../api/client';
import type { LoginPayload, RegisterPayload } from '../api/authApi';

interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
  role?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBusiness: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  adminLogin: (username: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('careerflow_token');
    const storedUser = localStorage.getItem('careerflow_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('careerflow_token');
        localStorage.removeItem('careerflow_user');
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handler = () => logout();

    window.addEventListener('auth:expired', handler);

    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  const persistAuth = useCallback(
      (data: {
        token: string;
        userId: string;
        fullName: string;
        email: string;
        role?: string;
      }) => {
        const u: AuthUser = {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        };

        localStorage.setItem('careerflow_token', data.token);
        localStorage.setItem('careerflow_user', JSON.stringify(u));

        setToken(data.token);
        setUser(u);
      },
      []
  );

  const login = useCallback(
      async (payload: LoginPayload) => {
        const data = await authApi.login(payload);

        persistAuth(data);

        return {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        };
      },
      [persistAuth]
  );

  const adminLogin = useCallback(
      async (username: string, password: string) => {
        const data = await apiPost<{ token: string }>(
            '/api/Admin/login',
            {
              username,
              password,
            },
            false
        );

        const adminUser: AuthUser = {
          userId: 'admin',
          fullName: username,
          email: username,
          role: 'Admin',
        };

        persistAuth({
          token: data.token,
          userId: adminUser.userId,
          fullName: adminUser.fullName,
          email: adminUser.email,
          role: adminUser.role,
        });

        return adminUser;
      },
      [persistAuth]
  );

  const register = useCallback(
      async (payload: RegisterPayload) => {
        const data = await authApi.register(payload);

        persistAuth(data);

        return {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        };
      },
      [persistAuth]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('careerflow_token');
    localStorage.removeItem('careerflow_user');

    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isBusiness = user?.role?.toLowerCase() === 'business';

  return (
      <AuthContext.Provider
          value={{
            user,
            token,
            isAuthenticated: !!token,
            isAdmin,
            isBusiness,
            isLoading,
            login,
            adminLogin,
            register,
            logout,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}