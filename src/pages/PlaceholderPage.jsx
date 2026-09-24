export function PlaceholderPage({ title, description }) {
  return <section className="placeholder-page"><span className="eyebrow">Module foundation</span><h2>{title}</h2><p>{description || "This workspace is reserved for a later implementation phase."}</p><div className="placeholder-line" /></section>;
}
