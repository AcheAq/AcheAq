import "./Pagination.css";

function Pagination({ currentPage, setCurrentPage }) {
  const pages = [1, 2, 3, 4, 5];

  return (
    <nav className="pagination-nav" aria-label="Navegação por páginas">
      <button
        type="button"
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`page-btn ${currentPage === page ? "active" : ""}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      <span className="page-dots">...</span>

      <button
        type="button"
        className="page-btn"
        onClick={() => setCurrentPage(16)}
      >
        16
      </button>

      <button
        type="button"
        className="page-btn"
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;