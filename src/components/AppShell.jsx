import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { dashboardPathForRole, roleLabel } from "../auth/auth.utils.js";

const navigation = {
  ADMIN: [
    ["Dashboard", "/admin"],
    ["Departments", "/admin/departments"],
    ["Academic Years", "/admin/academic-years"],
    ["Sections", "/admin/sections"],
    ["Students", "/admin/students"],
    ["Faculty", "/admin/faculty"],
    ["Subjects", "/admin/subjects"],
    ["Subject Offerings", "/admin/subject-offerings"],
    ["Enrollments", "/admin/enrollments"]
    , ["Corrections", "/admin/corrections"]
  ],
  FACULTY: [["Dashboard", "/faculty"], ["My Subjects", "/faculty/subjects"], ["Attendance", "/faculty/attendance"], ["Corrections", "/faculty/corrections"]],
  STUDENT: [["Dashboard", "/student"], ["My Attendance", "/student/attendance"], ["Corrections", "/student/corrections"]]
};

export function AppShell() {
  const { user, logout } = useAuth();
  const links = navigation[user.role] ?? [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <span className="brand-kicker">SAMS</span>
          <strong>Smart<br />Attendance</strong>
        </div>
        <nav className="nav-list" aria-label={`${roleLabel(user.role)} navigation`}>
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === dashboardPathForRole(user.role)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" /> Backend connected
        </div>
      </aside>
      <main className="main-column">
        <header className="topbar">
          <div>
            <span className="eyebrow">{roleLabel(user.role)} workspace</span>
            <h1>Good to see you, {user.name?.split(" ")[0] || "there"}.</h1>
          </div>
          <div className="user-actions">
            <div className="user-chip"><span className="avatar">{user.name?.charAt(0) || "U"}</span><span>{user.email}</span></div>
            <button className="button button-quiet" onClick={logout}>Log out</button>
          </div>
        </header>
        <div className="content-area"><Outlet /></div>
      </main>
    </div>
  );
}
