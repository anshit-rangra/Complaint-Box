const MAX_VISIBLE_PAGES = 5

const Pagination = ({ currentPage, totalPages, onPageChange, onPrevClick, onNextClick }) => {

  const getPageRange = () => {

    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    let end = start + MAX_VISIBLE_PAGES - 1

    if (start < 1) {
      start = 1
      end = MAX_VISIBLE_PAGES
    }

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, totalPages - MAX_VISIBLE_PAGES + 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const renderPageNumbers = () => {
    return getPageRange().map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        aria-current={page === currentPage ? "page" : undefined}
        className={`flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
          page === currentPage
            ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
            : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300"
        }`}
      >
        {page}
      </button>
    ))
  }

  return (
    <nav className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2">
      <button
        onClick={onPrevClick}
        disabled={currentPage <= 1}
        className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-300"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Prev
      </button>

      <div className="flex items-center gap-1">
        {totalPages > 0 && renderPageNumbers()}
      </div>

      <button
        onClick={onNextClick}
        disabled={currentPage >= totalPages}
        className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-300"
      >
        Next
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <span className="text-xs font-medium text-slate-500 sm:ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  )
}

export default Pagination