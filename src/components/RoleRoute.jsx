import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();
  return allowedRoles.includes(user?.role) ? <Outlet /> : <Navigate to="/403" replace />;
}
