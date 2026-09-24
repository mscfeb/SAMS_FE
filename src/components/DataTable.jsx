import { EmptyState } from "./EmptyState.jsx";
import { LoadingState } from "./LoadingState.jsx";

export function DataTable({ columns, rows, loading, onEdit, onDelete, deleteLabel = "Deactivate" }) {
  if (loading) return <LoadingState label="Loading records..." />;
  if (!rows.length) return <EmptyState message="No records match this view." />;
  return <div className="table-wrap"><table className="data-table"><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}{(onEdit || onDelete) && <th>Actions</th>}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key] ?? "-"}</td>)}{(onEdit || onDelete) && <td className="table-actions">{onEdit && <button className="text-button" onClick={() => onEdit(row)}>Edit</button>}{onDelete && <button className="text-button danger-text" onClick={() => onDelete(row)}>{deleteLabel}</button>}</td>}</tr>)}</tbody></table></div>;
}
