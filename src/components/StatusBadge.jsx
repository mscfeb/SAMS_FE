export function StatusBadge({ value }) {
  const label = String(value || "").replaceAll("_", " ").toLowerCase().replace(/^./, (character) => character.toUpperCase());
  return <span className={`status-badge status-${String(value).toLowerCase()}`}>{label}</span>;
}
