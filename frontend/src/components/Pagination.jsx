import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  function getPageNumbers() {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  }

  const pages = getPageNumbers();

  return (
    <nav className="pagination" aria-label="Hotel listings pagination navigation">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="pagination-arrow"
        title="Go to previous page"
      >
        <ChevronLeft size={16} />
        <span className="arrow-text">Prev</span>
      </button>

      <div className="pagination-numbers">
        {pages.map((item, idx) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="pagination-ellipsis" aria-hidden="true">
                …
              </span>
            );
          }

          const pageNum = Number(item);
          const isActive = currentPage === pageNum;

          return (
            <button
              type="button"
              key={`page-${pageNum}`}
              className={`pagination-number-btn ${isActive ? "active-page" : ""}`}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${pageNum}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="pagination-arrow"
        title="Go to next page"
      >
        <span className="arrow-text">Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
