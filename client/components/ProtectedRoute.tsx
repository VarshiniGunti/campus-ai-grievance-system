import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "@/utils/admin-auth";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export function ProtectedRoute({ element }: ProtectedRouteProps) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }

  return element;
}
