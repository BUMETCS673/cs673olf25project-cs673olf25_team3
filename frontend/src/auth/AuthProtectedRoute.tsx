/*

AI-generated: 5% (Tool: ChatGPT, suggested basic route protection pattern)
Human-written: 95% (function: AuthProtectedRoute; logic: redirect, token check, integration with useAuth)

Notes:
- The vast majority is human-written: the component, access token check, and redirect.
- AI contribution: minimal boilerplate reference for protected route concept.

*/
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface AuthProtectedRouteProps {
  children: ReactNode;
}

const AuthProtectedRoute = ({ children }: AuthProtectedRouteProps) => {
  const { auth } = useAuth();

      debugger
  // If no access token, redirect to login
  if (!auth.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthProtectedRoute;
