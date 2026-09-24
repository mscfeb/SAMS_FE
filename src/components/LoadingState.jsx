export function LoadingState({ label = "Loading..." }) {
  return <div className="state-panel" role="status">{label}</div>;
}
