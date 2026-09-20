import { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { complaintsContext } from '../context/ComplaintsContext'
import { ReadMoreText } from '../utils/helperFunction'
import { deleteComplaint, COMPLAINTS_PER_PAGE } from '../services/api/complaintApi'
import { toast } from 'react-toastify'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'

const ADMIN_PASSWORD = "anshit"
const ADMIN_AUTH_KEY = "admin_unlocked"

const AdminGate = ({ onUnlock }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, "true")
      onUnlock()
    } else {
      setError("Incorrect password, try again.")
      setPassword('')
    }
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-indigo-950/60 via-purple-950/30 to-transparent blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white sm:text-xl">Admin Access</h2>
        </div>

        <p className="mb-5 text-sm text-slate-400">
          Enter the password to unlock the admin panel.
        </p>

        <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-slate-300">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          autoFocus
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-opacity hover:opacity-90"
        >
          Unlock Panel
        </button>
      </form>
    </div>
  )
}

const Admin = () => {

  const notify = (m) => toast(m);
  const { complaintsData, setComplaintsData, currentPage, totalPages, setTotalPages, loading, fetchComplaints } = useContext(complaintsContext)
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(ADMIN_AUTH_KEY) === "true")
  const [deletingId, setDeletingId] = useState(null)

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) return
    fetchComplaints(page)
  }

  const handlePrevClick = () => {
    if (currentPage <= 1) return
    fetchComplaints(currentPage - 1)
  }

  const handleNextClick = () => {
    if (currentPage >= totalPages) return
    fetchComplaints(currentPage + 1)
  }

  const handleDeleteClick = async (e) => {

    const id = e.currentTarget.closest("article").dataset.id

    setDeletingId(id)

    const res = await deleteComplaint(id)

    let newArr = complaintsData?.complaints.filter(elem => elem._id !== id)

    const newTotal = complaintsData.total - 1

    setComplaintsData(prev => {
      return { ...prev, complaints: newArr, total: newTotal }
    })

    setTotalPages(Math.max(1, Math.ceil(newTotal / COMPLAINTS_PER_PAGE)))

    if (newArr.length === 0 && currentPage > 1) {
      fetchComplaints(currentPage - 1)
    }

    notify(res.message)

    setDeletingId(null)

  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar onOpen={() => {}} />

      {!unlocked ? <AdminGate onUnlock={() => setUnlocked(true)} /> : (
        <main className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-indigo-950/60 via-purple-950/30 to-transparent blur-3xl" />

          <section className="pt-8 sm:pt-10">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
                Complaints
                <span className="ml-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
                  {complaintsData?.total}
                </span>
              </h2>
              <button
                onClick={() => {
                  localStorage.removeItem(ADMIN_AUTH_KEY)
                  setUnlocked(false)
                }}
                className="cursor-pointer rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-300 sm:text-sm"
              >
                Lock
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <Loader text="Loading complaints..." />
              ) : (
                  complaintsData && complaintsData?.complaints?.map((complaint) => (
                <article
                  key={complaint._id}
                  data-id={complaint._id}
                  className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-red-500/40 hover:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white sm:text-base">
                        {complaint.title}
                      </h3>
                      <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                        Open
                      </span>
                    </div>
                    <ReadMoreText text={complaint.description} />
                  </div>

                  <button onClick={handleDeleteClick} disabled={deletingId === complaint._id} className="flex shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto">
                    {deletingId === complaint._id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-red-400" />
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14M10 11v6M14 11v6" />
                      </svg>
                    )}
                    Delete
                  </button>
</article>
                ))
              )}
            </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
          />
        </section>
        </main>
      )}
    </div>
  )
}

export default Admin