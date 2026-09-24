import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { dashboardPathForRole, roleLabel } from "../auth/auth.utils.js";

const roles = ["ADMIN", "FACULTY", "STUDENT"];

export function LoginPage() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [pendingRole, setPendingRole] = useState(null);
  const [error, setError] = useState("");

  if (!isLoading && isAuthenticated) return <Navigate to={dashboardPathForRole(user.role)} replace />;

  async function handleLogin(role) {
    setPendingRole(role);
    setError("");
    try {
      await login(role);
      navigate(dashboardPathForRole(role), { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setPendingRole(null);
    }
  }

  return (
    <main className="login-page">
      <section className="login-art" aria-hidden="true"><span>ATTENDANCE<br />WITH CLARITY</span></section>
      <section className="login-panel">
        <div className="brand-mark dark-brand"><span className="brand-kicker">SAMS</span><strong>Smart Attendance</strong></div>
        <div className="login-copy"><span className="eyebrow">Demo access</span><h1>Choose your workspace.</h1><p>Use a seeded role to enter the attendance system.</p></div>
        <div className="role-options">
          {roles.map((role) => <button key={role} className="role-button" disabled={Boolean(pendingRole)} onClick={() => handleLogin(role)}><span>{pendingRole === role ? "Signing in..." : roleLabel(role)}</span><span className="arrow">-&gt;</span></button>)}
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="login-note">Demo authentication uses the backend-issued JWT and seeded development users.</p>
      </section>
    </main>
  );
}
