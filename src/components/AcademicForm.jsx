import { useEffect, useState } from "react";

function initialValues(fields, record) {
  return Object.fromEntries(
    fields.map((field) => {
      const rawValue = field.getValue
        ? field.getValue(record)
        : field.name === "email" && record?.user
          ? record.user.email
          : record?.[field.name];
      const value =
        field.type === "date" && rawValue
          ? String(rawValue).slice(0, 10)
          : rawValue;
      return [field.name, value ?? field.defaultValue ?? ""];
    }),
  );
}

export function AcademicForm({
  fields,
  record,
  submitting,
  error,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues(fields, record));
  useEffect(() => setValues(initialValues(fields, record)), [fields, record]);

  function update(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const payload = {};
    for (const field of fields) {
      const value = values[field.name];
      if (field.type === "number") payload[field.name] = Number(value);
      else if (field.type === "checkbox") payload[field.name] = Boolean(value);
      else payload[field.name] = value;
    }
    onSubmit(payload);
  }

  return (
    <form className="academic-form" onSubmit={submit}>
      {fields.map((field) => (
        <label className="form-field" key={field.name}>
          <span>{field.label}</span>
          {field.type === "select" ? (
            <select
              value={values[field.name]}
              required={field.required !== false}
              onChange={(event) => update(field.name, event.target.value)}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {(field.options || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={Boolean(values[field.name])}
              onChange={(event) => update(field.name, event.target.checked)}
            />
          ) : (
            <input
              type={field.type || "text"}
              value={values[field.name]}
              required={field.required !== false}
              min={field.min}
              max={field.max}
              onChange={(event) => update(field.name, event.target.value)}
            />
          )}
        </label>
      ))}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button
          type="button"
          className="button button-quiet"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="button button-primary"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
