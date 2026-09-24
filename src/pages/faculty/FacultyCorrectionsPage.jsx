import { useEffect, useState } from "react";
import { createCorrection, getCorrections } from "../../api/corrections.api.js";
import { getAttendanceSession, getAttendanceSessions } from "../../api/attendance.api.js";
import { getFacultyDashboard } from "../../api/dashboard.api.js";
import { ErrorState } from "../../components/ErrorState.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { StatusBadge } from "../../components/StatusBadge.jsx";

export function FacultyCorrectionsPage() {
  const [data, setData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionRecords, setSessionRecords] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [form, setForm] = useState({ studentNumber: "", newStatus: "PRESENT", reason: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  async function load() { setData(await getCorrections({ page: 1, limit: 50 })); }
  useEffect(() => {
    Promise.all([
      load(),
      getFacultyDashboard(1).then(async (dashboard) => {
        const offeringIds = dashboard.offerings.map((offering) => offering.id);
        const results = await Promise.all(offeringIds.map((subjectOfferingId) => getAttendanceSessions({ subjectOfferingId, status: "SUBMITTED", page: 1, limit: 100 })));
        setSessions(results.flatMap((result) => result.items).sort((left, right) => String(right.sessionDate).localeCompare(String(left.sessionDate))));
      })
    ]).catch((requestError) => setError(requestError.message));
  }, []);
  if (!data && !error) return <LoadingState label="Loading corrections..." />;
  if (error && !data) return <ErrorState message={error} />;
  async function selectSession(sessionId) {
    setSelectedSessionId(sessionId);
    setSessionRecords([]);
    setForm((current) => ({ ...current, studentNumber: "" }));
    setError("");
    if (!sessionId) return;
    try {
      const session = await getAttendanceSession(sessionId);
      setSessionRecords(session.attendanceRecords);
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  async function submit(event) { event.preventDefault(); setSaving(true); setError(""); try { await createCorrection({ attendanceSessionId: selectedSessionId, studentNumber: form.studentNumber, newStatus: form.newStatus, reason: form.reason }); setForm({ studentNumber: "", newStatus: "PRESENT", reason: "" }); setSelectedSessionId(""); setSessionRecords([]); await load(); setNotice("Correction request submitted."); } catch (requestError) { setError(requestError.message); } finally { setSaving(false); } }
  const selectedSession = sessions.find((session) => session.id === selectedSessionId);
  return <><PageHeader eyebrow="Faculty workflow" title="Corrections" description="Request a controlled correction for submitted attendance. Admin review is required." /><div className="correction-layout"><form className="dashboard-section academic-form" onSubmit={submit}><h3>New request</h3><label className="form-field"><span>Submitted session</span><select value={selectedSessionId} onChange={(event) => selectSession(event.target.value)} required><option value="">Select date and subject</option>{sessions.map((session) => <option key={session.id} value={session.id}>{String(session.sessionDate).slice(0, 10)} · {session.subjectOffering?.subject?.code || "Attendance session"} · Period {session.period}</option>)}</select></label>{selectedSession && <p className="form-context">Session date: <strong>{String(selectedSession.sessionDate).slice(0, 10)}</strong></p>}<label className="form-field"><span>Student ID</span><select value={form.studentNumber} onChange={(event) => setForm({ ...form, studentNumber: event.target.value })} required disabled={!selectedSessionId}><option value="">Select student ID</option>{sessionRecords.map((record) => <option key={record.id} value={record.student.studentNumber}>{record.student.studentNumber} · {record.student.firstName} {record.student.lastName} · Current: {record.status}</option>)}</select></label><label className="form-field"><span>Requested status</span><select value={form.newStatus} onChange={(event) => setForm({ ...form, newStatus: event.target.value })}><option>PRESENT</option><option>ABSENT</option><option>LATE</option></select></label><label className="form-field"><span>Reason</span><textarea value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} rows="4" required /></label>{error && <p className="form-error">{error}</p>}{notice && <p className="success-text">{notice}</p>}<button className="button button-primary" disabled={saving || !form.studentNumber}>{saving ? "Submitting..." : "Submit request"}</button></form><div className="dashboard-section"><h3>My requests</h3><div className="mini-list">{data.items.map((item) => <div className="correction-row" key={item.id}><div><strong>{item.attendanceRecord.student.studentNumber} · {item.attendanceRecord.student.firstName} {item.attendanceRecord.student.lastName}</strong><span>{String(item.attendanceRecord.attendanceSession.sessionDate).slice(0, 10)} · {item.attendanceRecord.attendanceSession.subjectOffering.subject.code} · {item.oldStatus} → {item.newStatus}</span><small>{item.reason}</small></div><StatusBadge value={item.status} /></div>)}</div></div></div></>;
}
