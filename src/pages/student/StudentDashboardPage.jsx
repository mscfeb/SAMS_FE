import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../api/dashboard.api.js";
import { ErrorState } from "../../components/ErrorState.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { StatCard } from "../../components/StatCard.jsx";
import { StatusBadge } from "../../components/StatusBadge.jsx";

export function StudentDashboardPage() {
  const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { getStudentDashboard(5).then(setData).catch((requestError) => setError(requestError.message)); }, []);
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState label="Loading student workspace..." />;
  const overall = data.attendance.overall;
  return <><PageHeader eyebrow="Student workspace" title="Your attendance at a glance" description="Official attendance includes submitted sessions only." /><div className="stat-grid"><StatCard label="Attendance" value={`${overall.attendancePercentage}%`} detail={overall.lowAttendance ? `Below ${data.lowAttendanceThreshold}%` : "On track"} /><StatCard label="Attended" value={overall.attended} /><StatCard label="Sessions" value={overall.totalSessions} /><StatCard label="Subjects" value={data.enrolledSubjects.length} /></div><section className="dashboard-section"><h3>Subject attendance</h3><div className="mini-list">{data.attendance.subjects.map((subject) => <div className="mini-row" key={subject.subjectOfferingId}><div><strong>{subject.subjectCode}</strong><span>{subject.subjectName}</span></div><div className="summary-value"><strong>{subject.attendancePercentage}%</strong>{subject.lowAttendance && <StatusBadge value="LOW" />}</div></div>)}</div></section></>;
}
