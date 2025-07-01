// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { parseJwt } from "@/utils/jwt";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      const payload = parseJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (!payload?.exp || payload.exp < currentTime) {
        clearToken();
      }
    }
  }, [token, clearToken]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
