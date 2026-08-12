import './ListPagination.css';

export default function ListPagination({
  page,
  pageCount,
  pageSize,
  totalCount,
  onPageChange,
  className = '',
}) {
  if (totalCount <= pageSize) return null;

  const safePage = Math.min(page, pageCount - 1);
  const rangeStart = safePage * pageSize + 1;
  const rangeEnd = Math.min((safePage + 1) * pageSize, totalCount);

  return (
    <div className={`list-pagination${className ? ` ${className}` : ''}`}>
      <span className="list-pagination__summary">
        Showing {rangeStart}–{rangeEnd} of {totalCount}
      </span>
      <div className="list-pagination__controls">
        <button
          type="button"
          className="list-pagination__btn"
          onClick={() => onPageChange(Math.max(0, safePage - 1))}
          disabled={safePage === 0}
        >
          Prev
        </button>
        {Array.from({ length: pageCount }, (_, pageIndex) => (
          <button
            key={`page-${pageIndex}`}
            type="button"
            className={`list-pagination__btn list-pagination__btn--number${pageIndex === safePage ? ' is-active' : ''}`}
            onClick={() => onPageChange(pageIndex)}
            aria-current={pageIndex === safePage ? 'page' : undefined}
          >
            {pageIndex + 1}
          </button>
        ))}
        <button
          type="button"
          className="list-pagination__btn"
          onClick={() => onPageChange(Math.min(pageCount - 1, safePage + 1))}
          disabled={safePage >= pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
