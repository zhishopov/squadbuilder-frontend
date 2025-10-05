import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace></Navigate>;
  }

  return <Outlet></Outlet>;
}
