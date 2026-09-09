import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  token: string | null;
  children: React.ReactNode;
};

export const ProtectedRoute = ({ token, children }: ProtectedRouteProps) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};