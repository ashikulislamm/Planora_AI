"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, User } from "../services/auth.service";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    // Check if token exists in localStorage (client-side only)
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await authService.getMe();
      if (res.success && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run once on load to verify token cookie
  useEffect(() => {
    fetchUser();
  }, []);

  // Simple client-side route guard logic
  useEffect(() => {
    if (loading) return;

    const publicRoutes = ["/", "/login", "/register"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      // Redirect unauthorized user trying to access /dashboard
      router.push("/login");
    } else if (user && (pathname === "/login" || pathname === "/register")) {
      // Redirect logged in user trying to access login/register
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.data.user) {
        setUser(res.data.user);
        // Fallback for JWT bearer token
        if ((res.data as any).accessToken) {
          localStorage.setItem("token", (res.data as any).accessToken);
        }
        router.push("/dashboard");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.success && res.data.user) {
        setUser(res.data.user);
        // Fallback for JWT bearer token
        if ((res.data as any).accessToken) {
          localStorage.setItem("token", (res.data as any).accessToken);
        }
        router.push("/dashboard");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      setLoading(false);
      router.push("/login");
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.data.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
