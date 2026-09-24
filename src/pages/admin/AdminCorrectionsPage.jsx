import { useEffect, useState } from "react";
import { approveCorrection, getCorrections, rejectCorrection } from "../../api/corrections.api.js";
import { ErrorState } from "../../components/ErrorState.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { StatusBadge } from "../../components/StatusBadge.jsx";
import { Pagination } from "../../components/Pagination.jsx";

export function AdminCorrectionsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);

  async function load(nextPage = page) {
    setData(await getCorrections({ page: nextPage, limit: 20 }));
  }

  useEffect(() => {
    load(page).catch((requestError) => setError(requestError.message));
  }, [page]);

  async function review(id, action) {
    if (!window.confirm(`${action === "approve" ? "Approve" : "Reject"} this correction request?`)) return;
    setWorkingId(id);
    setError("");
    try {
      if (action === "approve") await approveCorrection(id);
      else await rejectCorrection(id);
      await load(page);
      setNotice(`Correction ${action}d successfully.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId("");
    }
  }

  if (!data && !error) return <LoadingState label="Loading correction requests..." />;
  if (error && !data) return <ErrorState message={error} />;

  return <>
    <PageHeader eyebrow="Admin review" title="Correction requests" description="Review submitted-attendance corrections. Approval updates the record through the backend transaction." />
    {notice && <div className="notice" role="status">{notice}</div>}
    {error && <div className="form-error page-error" role="alert">{error}</div>}
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Student</th><th>Session</th><th>Change</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead><tbody>{data.items.map((item) => { const record = item.attendanceRecord; const session = record?.attendanceSession; return <tr key={item.id}><td><strong>{record?.student?.studentNumber}</strong><br /><span>{record?.student?.firstName} {record?.student?.lastName}</span></td><td>{session ? <><strong>{String(session.sessionDate).slice(0, 10)}</strong><br /><span>{session.subjectOffering?.subject?.code} · Period {session.period}</span></> : "-"}</td><td>{item.oldStatus} → {item.newStatus}</td><td>{item.reason}</td><td><StatusBadge value={item.status} /></td><td className="table-actions">{item.status === "PENDING" ? <><button className="text-button" disabled={workingId === item.id} onClick={() => review(item.id, "approve")}>{workingId === item.id ? "Working..." : "Approve"}</button><button className="text-button danger-text" disabled={workingId === item.id} onClick={() => review(item.id, "reject")}>Reject</button></> : <span className="muted-text">Reviewed</span>}</td></tr>; })}</tbody></table></div>
    <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} />
  </>;
}
