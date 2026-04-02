export default function NavButtons({
  currentIndex,
  total,
  onPrev,
  onNext
}) {
  const showing = total > 0 ? currentIndex + 1 : 0;
  const label =
    total > 0 ? `Showing website ${showing} of ${total}` : "No websites loaded";

  return (
    <div className="nav-buttons">
      <button
        type="button"
        className="btn btn-nav"
        onClick={onPrev}
        disabled={currentIndex === 0 || total === 0}
      >
        Previous
      </button>
      <span className="nav-buttons-counter">{label}</span>
      <button
        type="button"
        className="btn btn-nav"
        onClick={onNext}
        disabled={total === 0 || currentIndex === total - 1}
      >
        Next
      </button>
    </div>
  );
}
