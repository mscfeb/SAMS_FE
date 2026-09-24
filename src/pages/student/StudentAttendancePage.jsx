import { useEffect, useState } from "react";
import { getStudentAttendance, getStudentAttendanceHistory } from "../../api/attendance.api.js";
import { ErrorState } from "../../components/ErrorState.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { StatusBadge } from "../../components/StatusBadge.jsx";

export function StudentAttendancePage() {
  const [summary, setSummary] = useState(null); const [history, setHistory] = useState(null); const [page, setPage] = useState(1); const [error, setError] = useState("");
  useEffect(() => { Promise.all([getStudentAttendance(), getStudentAttendanceHistory({ page, limit: 20 })]).then(([summaryResult, historyResult]) => { setSummary(summaryResult); setHistory(historyResult); }).catch((requestError) => setError(requestError.message)); }, [page]);
  if (error) return <ErrorState message={error} />;
  if (!summary || !history) return <LoadingState label="Loading attendance history..." />;
  return <><PageHeader eyebrow="Attendance history" title="My attendance" description="Your subject summaries and submitted attendance history." /><section className="dashboard-section"><h3>Subject summary</h3><div className="mini-list">{summary.subjects.map((subject) => <div className="mini-row" key={subject.subjectOfferingId}><div><strong>{subject.subjectCode}</strong><span>{subject.subjectName}</span></div><div className="summary-value"><strong>{subject.attendancePercentage}%</strong><span>{subject.attended}/{subject.totalSessions} attended</span></div></div>)}</div></section><section className="dashboard-section history-section"><h3>Recent records</h3><div className="mini-list">{history.items.map((record) => <div className="mini-row" key={record.id}><div><strong>{record.attendanceSession.subjectOffering.subject.code}</strong><span>{String(record.attendanceSession.sessionDate).slice(0, 10)} · Period {record.attendanceSession.period}</span></div><StatusBadge value={record.status} /></div>)}</div><Pagination page={history.pagination.page} totalPages={history.pagination.totalPages} onChange={setPage} /></section></>;
}
