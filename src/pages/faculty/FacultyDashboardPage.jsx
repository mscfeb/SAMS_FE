import { useEffect, useState } from "react";
import { getFacultyDashboard } from "../../api/dashboard.api.js";
import { ErrorState } from "../../components/ErrorState.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { StatCard } from "../../components/StatCard.jsx";
import { StatusBadge } from "../../components/StatusBadge.jsx";

export function FacultyDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getFacultyDashboard()
      .then(setData)
      .catch((requestError) => setError(requestError.message));
  }, []);
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState label="Loading faculty workspace..." />;
  return (
    <>
      <PageHeader
        eyebrow="Faculty workspace"
        title="Your teaching desk"
        description="Assigned subjects, recent sessions, and attendance work in one place."
      />
      <div className="stat-grid">
        <StatCard label="Assigned offerings" value={data.offerings.length} />
        <StatCard
          label="Draft sessions"
          value={data.sessions.draft}
          detail="Need completion"
        />
        <StatCard label="Submitted sessions" value={data.sessions.submitted} />
        <StatCard
          label="Low attendance"
          value={data.lowAttendanceStudents}
          detail={`Below ${data.lowAttendanceThreshold}%`}
        />
      </div>
      <section className="dashboard-grid">
        <div className="dashboard-section">
          <h3>My subjects</h3>
          <div className="mini-list">
            {data.offerings.map((offering) => (
              <div className="mini-row" key={offering.id}>
                <div>
                  <strong>{offering.subject.code}</strong>
                  <span>
                    {offering.subject.name} · {offering.section.name}
                  </span>
                </div>
                <span>{offering.academicYear.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-section">
          <h3>Recent sessions</h3>
          <div className="mini-list">
            {data.sessions.recent.map((session) => (
              <div className="mini-row" key={session.id}>
                <div>
                  <strong>{session.subjectOffering.subject.code}</strong>
                  <span>
                    {String(session.sessionDate).slice(0, 10)} · Period{" "}
                    {session.period}
                  </span>
                </div>
                <StatusBadge value={session.status} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
