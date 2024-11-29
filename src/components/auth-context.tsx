"use client";

import { authService } from "@/services/auth.service";
import { useRouter, usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  redirectToHomePage: () => { },
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const redirectToHomePage = useCallback(() => {
    const noAuthPathnames = ['/login', '/register'];
    if (!noAuthPathnames.includes(pathname)) {
      router.push('/');
    }
  }, [pathname, router]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  useEffect(() => {
    const fetchIsAuth = async () => {
      const authorized = await authService.isAuthorized(redirectToHomePage);
      if (authorized) {
        login();
      }
      else {
        logout();
      }
    };
    fetchIsAuth();
  }, [redirectToHomePage]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, redirectToHomePage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);