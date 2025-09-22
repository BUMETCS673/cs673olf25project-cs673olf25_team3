// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface AuthProtectedRouteProps {
  children: ReactNode;
}

const AuthProtectedRoute = ({ children }: AuthProtectedRouteProps) => {
  const { auth } = useAuth();

  // If no access token, redirect to login
  if (!auth.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthProtectedRoute;
