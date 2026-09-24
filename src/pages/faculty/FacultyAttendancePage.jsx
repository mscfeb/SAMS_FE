import { useEffect, useState } from "react";
import { getFacultyDashboard } from "../../api/dashboard.api.js";
import { createAttendanceSession, getAttendanceSession, getAttendanceSessions, submitAttendanceSession, updateAttendanceRecord } from "../../api/attendance.api.js";
import { ErrorState } from "../../components/ErrorState.jsx";
import { InlineSelect } from "../../components/InlineSelect.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { StatusBadge } from "../../components/StatusBadge.jsx";

const statuses = [{ value: "PRESENT", label: "Present" }, { value: "ABSENT", label: "Absent" }, { value: "LATE", label: "Late" }];

export function FacultyAttendancePage() {
  const [offerings, setOfferings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [form, setForm] = useState({ sessionDate: new Date().toISOString().slice(0, 10), period: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadSessions(offeringId = selectedOffering) {
    const result = await getAttendanceSessions({ subjectOfferingId: offeringId || undefined, page: 1, limit: 100 });
    setSessions(result.items);
  }
  useEffect(() => { getFacultyDashboard(10).then(async (data) => { setOfferings(data.offerings); if (data.offerings[0]) { setSelectedOffering(data.offerings[0].id); const result = await getAttendanceSessions({ subjectOfferingId: data.offerings[0].id, page: 1, limit: 100 }); setSessions(result.items); } }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingState label="Loading attendance workspace..." />;
  if (error && !offerings.length) return <ErrorState message={error} />;

  async function changeOffering(value) { setSelectedOffering(value); setSelectedSession(null); setError(""); try { await loadSessions(value); } catch (requestError) { setError(requestError.message); } }
  async function createSession(event) { event.preventDefault(); setSaving(true); setError(""); try { const session = await createAttendanceSession({ subjectOfferingId: selectedOffering, sessionDate: form.sessionDate, period: Number(form.period) }); await loadSessions(); setSelectedSession(await getAttendanceSession(session.id)); setNotice("Draft session created with UNMARKED records."); } catch (requestError) { setError(requestError.message); } finally { setSaving(false); } }
  async function openSession(id) { setError(""); try { setSelectedSession(await getAttendanceSession(id)); } catch (requestError) { setError(requestError.message); } }
  async function mark(recordId, status) { setError(""); try { await updateAttendanceRecord(recordId, status); setSelectedSession(await getAttendanceSession(selectedSession.id)); } catch (requestError) { setError(requestError.message); } }
  async function submit() { setSaving(true); setError(""); try { await submitAttendanceSession(selectedSession.id); setSelectedSession(await getAttendanceSession(selectedSession.id)); await loadSessions(); setNotice("Attendance submitted and locked."); } catch (requestError) { setError(requestError.message); } finally { setSaving(false); } }
  const selectedOfferingData = offerings.find((offering) => offering.id === selectedOffering);
  const unmarked = selectedSession?.attendanceRecords.filter((record) => record.status === "UNMARKED").length || 0;

  return <><PageHeader eyebrow="Faculty workflow" title="Attendance" description="Create a session, mark every enrolled student, then submit it to lock the record." /><div className="attendance-toolbar"><select className="filter-select" value={selectedOffering} onChange={(event) => changeOffering(event.target.value)}><option value="">Select subject offering</option>{offerings.map((offering) => <option key={offering.id} value={offering.id}>{offering.subject.code} · {offering.section.name}</option>)}</select><form className="session-create-form" onSubmit={createSession}><input className="date-input" type="date" value={form.sessionDate} onChange={(event) => setForm({ ...form, sessionDate: event.target.value })} required /><input className="period-input" type="number" min="1" value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })} required /><button className="button button-primary" disabled={!selectedOffering || saving}>{saving ? "Working..." : "New session"}</button></form></div>{notice && <div className="notice" role="status">{notice}</div>}{error && <div className="form-error page-error" role="alert">{error}</div>}<section className="attendance-layout"><div className="dashboard-section"><h3>{selectedOfferingData ? `${selectedOfferingData.subject.code} sessions` : "Sessions"}</h3><div className="mini-list">{sessions.map((session) => <button className={`session-row ${selectedSession?.id === session.id ? "selected" : ""}`} key={session.id} onClick={() => openSession(session.id)}><span>{String(session.sessionDate).slice(0, 10)} · Period {session.period}</span><StatusBadge value={session.status} /></button>)}</div></div>{selectedSession && <div className="dashboard-section attendance-roster"><div className="section-heading"><div><h3>Roster</h3><span>{unmarked} unmarked</span></div>{selectedSession.status === "DRAFT" && <button className="button button-primary" disabled={saving || unmarked > 0} onClick={submit}>Submit session</button>}</div>{selectedSession.attendanceRecords.map((record) => <div className="record-row" key={record.id}><div><strong>{record.student.firstName} {record.student.lastName}</strong><span>{record.student.studentNumber}</span></div>{selectedSession.status === "DRAFT" ? <InlineSelect label={`Status for ${record.student.studentNumber}`} value={record.status === "UNMARKED" ? "" : record.status} options={[{ value: "", label: "Unmarked" }, ...statuses]} onChange={(value) => value && mark(record.id, value)} /> : <StatusBadge value={record.status} />}</div>)}</div>}</section></>;
}
