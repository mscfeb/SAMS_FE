import { useEffect, useMemo, useState } from "react";
import { createAcademic, deleteAcademic, listAcademic, updateAcademic } from "../../api/academic.api.js";
import { AcademicForm } from "../../components/AcademicForm.jsx";
import { DataTable } from "../../components/DataTable.jsx";
import { Modal } from "../../components/Modal.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { loadOptions, resourceConfigs } from "./resource-config.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";

const resourcePaths = {
  departments: "departments",
  academicYears: "academic-years",
  sections: "sections",
  students: "students",
  faculty: "faculty",
  subjects: "subjects",
  subjectOfferings: "subject-offerings",
  enrollments: "enrollments"
};

export function AcademicResourcePage({ resource }) {
  const config = resourceConfigs[resource];
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 0 });
  const [query, setQuery] = useState({ search: "", page: 1, limit: 20 });
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const debouncedSearch = useDebouncedValue(query.search || "");

  const optionFields = useMemo(() => config.fields.filter((field) => field.endpoint), [config.fields]);
  const filterFields = useMemo(() => (config.filters || []).map((name) => config.fields.find((field) => field.name === name) || { name, label: name }), [config]);
  const dependencyFields = useMemo(() => {
    const fields = formOpen ? optionFields : filterFields.filter((field) => field.endpoint);
    return [...new Map(fields.map((field) => [field.endpoint, field])).values()];
  }, [formOpen, optionFields, filterFields]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const requestQuery = { ...query, search: debouncedSearch };
        const result = await listAcademic(resourcePaths[resource], Object.fromEntries(Object.entries(requestQuery).filter(([, value]) => value !== "")));
        if (active) {
          setRows(result.items);
          setPagination(result.pagination);
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [resource, query.page, query.limit, query.search, debouncedSearch, ...((config.filters || []).map((filter) => query[filter]))]);

  useEffect(() => {
    let active = true;
    async function loadDependencies() {
      try {
        const entries = await Promise.all(optionFields.map(async (field) => [field.name, await loadOptions(field)]));
        if (active) setOptions(Object.fromEntries(entries));
      } catch (requestError) {
        if (active) setError(`Could not load form options: ${requestError.message}`);
      }
    }
    if (dependencyFields.length) loadDependencies();
    return () => { active = false; };
  }, [dependencyFields]);

  const fields = config.fields.map((field) => ({ ...field, options: field.endpoint ? options[field.name] || [] : field.options }));
  const filterOptions = filterFields.map((field) => ({ ...field, options: field.endpoint ? options[field.name] || [] : field.options }));

  function openCreate() {
    setEditing(null);
    setError("");
    setFormOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setError("");
    setFormOpen(true);
  }

  async function save(payload) {
    setSubmitting(true);
    setError("");
    try {
      if (editing) await updateAcademic(resourcePaths[resource], editing.id, payload);
      else await createAcademic(resourcePaths[resource], payload);
      setFormOpen(false);
      setNotice(`${config.singular} ${editing ? "updated" : "created"}.`);
      setQuery((current) => ({ ...current, page: editing ? current.page : 1 }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(row) {
    const label = row.name || row.studentNumber || row.employeeNumber || row.code || "this record";
    if (!window.confirm(`${config.deleteLabel} ${label}? This action is handled by the backend.`)) return;
    setError("");
    try {
      await deleteAcademic(resourcePaths[resource], row.id);
      setNotice(`${config.singular} ${config.deleteLabel.toLowerCase()}d.`);
      setQuery((current) => ({ ...current }));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function updateQuery(name, value) {
    setQuery((current) => ({ ...current, [name]: value, page: name === "page" ? value : 1 }));
  }

  return <>
    <PageHeader title={config.title} description={config.description} actionLabel={`Add ${config.singular}`} onAction={openCreate} />
    <div className="resource-toolbar">
      <input className="search-input" aria-label="Search" placeholder={config.searchPlaceholder || "Search"} value={query.search || ""} onChange={(event) => updateQuery("search", event.target.value)} />
      {filterOptions.map((field) => field.options ? <select className="filter-select" aria-label={field.label} key={field.name} value={query[field.name] || ""} onChange={(event) => updateQuery(field.name, event.target.value)}><option value="">All {field.label.toLowerCase()}s</option>{field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : null)}
    </div>
    {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notification">×</button></div>}
    {error && !formOpen && <div className="form-error page-error" role="alert">{error}</div>}
    <DataTable columns={config.columns} rows={rows} loading={loading} onEdit={openEdit} onDelete={remove} deleteLabel={config.deleteLabel} />
    {!loading && <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(page) => updateQuery("page", page)} />}
    {formOpen && <Modal title={`${editing ? "Edit" : "Add"} ${config.singular}`} onClose={() => setFormOpen(false)}><AcademicForm fields={fields} record={editing} submitting={submitting} error={error} onSubmit={save} onCancel={() => setFormOpen(false)} /></Modal>}
  </>;
}
