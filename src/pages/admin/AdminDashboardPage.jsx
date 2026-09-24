import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../../api/dashboard.api.js";
import { ErrorState } from "../../components/ErrorState.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { StatCard } from "../../components/StatCard.jsx";

export function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getAdminDashboard().then(setData).catch((requestError) => setError(requestError.message)); }, []);
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState label="Loading admin overview..." />;
  return <><PageHeader eyebrow="Admin overview" title="Institution at a glance" description="Academic activity, attendance health, and items that need review." /><div className="stat-grid"><StatCard label="Students" value={data.academic.activeStudents} detail={`${data.academic.students} total`} /><StatCard label="Faculty" value={data.academic.activeFaculty} /><StatCard label="Submitted sessions" value={data.attendance.submittedSessions} /><StatCard label="Pending corrections" value={data.attendance.pendingCorrections} /></div><section className="dashboard-section admin-action-panel"><div><h3>Correction review</h3><p>Submitted attendance corrections are waiting for Admin approval.</p></div><Link className="button button-primary" to="/admin/corrections">Review requests</Link></section></>;
}
