export function ErrorState({ message, onRetry }) {
  return (
    <section className="state-panel error-panel">
      <p>{message}</p>
      {onRetry && <button className="button button-secondary" onClick={onRetry}>Try again</button>}
    </section>
  );
}
