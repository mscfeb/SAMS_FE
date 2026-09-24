export function InlineSelect({ value, options, onChange, disabled = false, label }) {
  return <select className="inline-select" aria-label={label} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>;
}
