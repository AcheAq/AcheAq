import "./Pagination.css";

function Pagination({ currentPage, totalPages = 1, setCurrentPage }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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

      <button
        type="button"
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
      >
        ›
      </button>
    </nav>
  );
}


export default Pagination;