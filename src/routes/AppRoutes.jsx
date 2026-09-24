import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { dashboardPathForRole } from "../auth/auth.utils.js";
import { AppShell } from "../components/AppShell.jsx";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import { RoleRoute } from "../components/RoleRoute.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { PlaceholderPage } from "../pages/PlaceholderPage.jsx";
import { AccessDeniedPage, NotFoundPage } from "../pages/StatusPages.jsx";
import { AcademicResourcePage } from "../pages/admin/AcademicResourcePage.jsx";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage.jsx";
import { AdminCorrectionsPage } from "../pages/admin/AdminCorrectionsPage.jsx";
import { FacultyDashboardPage } from "../pages/faculty/FacultyDashboardPage.jsx";
import { FacultySubjectsPage } from "../pages/faculty/FacultySubjectsPage.jsx";
import { FacultyAttendancePage } from "../pages/faculty/FacultyAttendancePage.jsx";
import { FacultyCorrectionsPage } from "../pages/faculty/FacultyCorrectionsPage.jsx";
import { StudentDashboardPage } from "../pages/student/StudentDashboardPage.jsx";
import { StudentAttendancePage } from "../pages/student/StudentAttendancePage.jsx";
import { StudentCorrectionsPage } from "../pages/student/StudentCorrectionsPage.jsx";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={dashboardPathForRole(user.role)} replace />;
}

function RolePlaceholder({ title }) {
  return <PlaceholderPage title={title} description="The application shell is ready. This module will be connected to the backend in a later frontend phase." />;
}

function RoleRoutes({ role, basePath, links }) {
  return (
    <Route element={<RoleRoute allowedRoles={[role]} />}>
      <Route path={basePath} element={<AppShell />}>
        <Route index element={<RolePlaceholder title={`${role.charAt(0)}${role.slice(1).toLowerCase()} dashboard`} />} />
        {links.map(([path, title]) => <Route key={path} path={path} element={<RolePlaceholder title={title} />} />)}
      </Route>
    </Route>
  );
}

function facultyRoutes() {
  return (
    <Route element={<RoleRoute allowedRoles={["FACULTY"]} />}>
      <Route path="/faculty" element={<AppShell />}>
        <Route index element={<FacultyDashboardPage />} />
        <Route path="subjects" element={<FacultySubjectsPage />} />
        <Route path="attendance" element={<FacultyAttendancePage />} />
        <Route path="corrections" element={<FacultyCorrectionsPage />} />
      </Route>
    </Route>
  );
}

function studentRoutes() {
  return (
    <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
      <Route path="/student" element={<AppShell />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="attendance" element={<StudentAttendancePage />} />
        <Route path="corrections" element={<StudentCorrectionsPage />} />
      </Route>
    </Route>
  );
}

const adminResources = [
  ["departments", "departments"],
  ["academic-years", "academicYears"],
  ["sections", "sections"],
  ["students", "students"],
  ["faculty", "faculty"],
  ["subjects", "subjects"],
  ["subject-offerings", "subjectOfferings"],
  ["enrollments", "enrollments"]
];

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<AccessDeniedPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AppShell />}>
            <Route index element={<AdminDashboardPage />} />
            {adminResources.map(([path, resource]) => <Route key={path} path={path} element={<AcademicResourcePage resource={resource} />} />)}
            <Route path="corrections" element={<AdminCorrectionsPage />} />
          </Route>
        </Route>
        {facultyRoutes()}
        {studentRoutes()}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
