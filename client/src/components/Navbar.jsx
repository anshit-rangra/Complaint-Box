const Navbar = ({ onOpen }) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 sm:h-10 sm:w-10">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 10h.01M12 10h.01M16 10h.01M18 20l-3-3H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-4z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-white sm:text-lg">
            Complaint<span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Box</span>
          </span>
        </div>

        <button
          onClick={onOpen}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-opacity hover:opacity-90 sm:gap-2 sm:px-5 sm:py-2.5"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden text-xs sm:inline sm:text-sm">Add Complaint</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar