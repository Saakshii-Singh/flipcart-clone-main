import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { AuthUser, SignInPayload, SignUpPayload } from '@/types/app';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const invalidateUserData = () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
  };

  const refreshSession = async () => {
    try {
      const data = await apiGet<{ user: AuthUser | null }>('/session');
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const signIn = async (payload: SignInPayload) => {
    const data = await apiPost<{ user: AuthUser }>('/login', payload);
    setUser(data.user);
    invalidateUserData();
  };

  const signUp = async (payload: SignUpPayload) => {
    const data = await apiPost<{ user: AuthUser }>('/signup', payload);
    setUser(data.user);
    invalidateUserData();
  };

  const signOut = async () => {
    try {
      await apiGet('/logout');
    } catch {
      // Even if server logout fails, clear client state
    }
    setUser(null);
    invalidateUserData();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
