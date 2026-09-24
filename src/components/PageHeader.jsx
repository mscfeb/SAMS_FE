export function PageHeader({ eyebrow = "Academic management", title, description, actionLabel, onAction }) {
  return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{actionLabel && <button className="button button-primary" onClick={onAction}>+ {actionLabel}</button>}</div>;
}
