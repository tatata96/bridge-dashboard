import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";

import { useAuth } from "@/auth/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  // Rendered while the stored session is being restored, so the app shell
  // can stay on screen instead of a blank full-page loader.
  loadingContent: ReactNode;
};

export function ProtectedRoute({
  children,
  loadingContent,
}: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return loadingContent;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
