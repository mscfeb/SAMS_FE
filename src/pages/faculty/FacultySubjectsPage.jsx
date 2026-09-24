import { useEffect, useState } from "react";
import { getFacultyDashboard } from "../../api/dashboard.api.js";
import { ErrorState } from "../../components/ErrorState.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";

export function FacultySubjectsPage() {
  const [offerings, setOfferings] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getFacultyDashboard(1).then((data) => setOfferings(data.offerings)).catch((requestError) => setError(requestError.message)); }, []);
  if (error) return <ErrorState message={error} />;
  if (!offerings) return <LoadingState label="Loading assigned subjects..." />;
  return <><PageHeader eyebrow="Teaching assignments" title="My subjects" description="Subject offerings assigned to your faculty identity." /><div className="offering-grid">{offerings.map((offering) => <article className="offering-card" key={offering.id}><span className="eyebrow">{offering.academicYear.name}</span><h3>{offering.subject.code}</h3><p>{offering.subject.name}</p><div className="card-meta"><span>{offering.section.name}</span><span>Semester {offering.semester}</span></div></article>)}</div></>;
}
