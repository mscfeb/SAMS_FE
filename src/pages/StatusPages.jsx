import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { dashboardPathForRole } from "../auth/auth.utils.js";

export function AccessDeniedPage() {
  const { user } = useAuth();
  return <main className="status-page"><span className="status-code">403</span><h1>That area is restricted.</h1><p>Your account does not have access to this workspace.</p>{user && <Link className="button button-primary" to={dashboardPathForRole(user.role)}>Return to workspace</Link>}</main>;
}

export function NotFoundPage() {
  const { user } = useAuth();
  return <main className="status-page"><span className="status-code">404</span><h1>Page not found.</h1><p>The route you requested does not exist.</p>{user ? <Link className="button button-primary" to={dashboardPathForRole(user.role)}>Return to workspace</Link> : <Link className="button button-primary" to="/login">Return to login</Link>}</main>;
}
