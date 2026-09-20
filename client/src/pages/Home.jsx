import { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import Form from '../components/Form'
import { complaintsContext } from '../context/ComplaintsContext'
import { ReadMoreText } from '../utils/helperFunction'
import { likeComplaint } from '../services/api/complaintApi'
import { toast } from 'react-toastify'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'




const Home = () => {

  const notify = (m) => toast(m);
  const { complaintsData, setComplaintsData, currentPage, totalPages, loading, fetchComplaints } = useContext(complaintsContext)
  const [showForm, setShowForm] = useState(false)
  const [likeId, setLikeId] = useState(null)

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

  const handleLikeClick = async (e) => {

    const id = e.currentTarget.closest("article").dataset.id


    e.target.value = Number(e.target.value) + 1;

    let index = complaintsData.complaints.findIndex(e => e._id === id)

    setLikeId(id)

    const res = await likeComplaint(id)

    let newArr = complaintsData?.complaints.map((elem, idx) => {

      if(idx == index){

        if(res.cmd == "added"){
          elem.likes = elem.likes + 1
        } else if (res.cmd == "remove"){
          elem.likes = elem.likes - 1
        }

      }

      return elem
    })

    setComplaintsData(prev => {
      return {...prev, complaints: newArr}
    })

    notify(res.message)

    setLikeId(null)

  }


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar onOpen={() => setShowForm(true)} />

      {showForm && <Form onClose={() => setShowForm(false)} />}

      <main className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-indigo-950/60 via-purple-950/30 to-transparent blur-3xl" />

        <section className="pt-8 sm:pt-10">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
              Recent Complaints
              <span className="ml-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
                {complaintsData?.total}
              </span>
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <Loader text="Loading complaints..." />
            ) : (
              complaintsData && complaintsData?.complaints?.map((complaint) => (
              <article
                key={complaint._id}
                data-id={complaint._id}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-indigo-500/40 hover:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:p-5"
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

                <button onClick={handleLikeClick} disabled={likeId === complaint._id} className="flex shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors group-hover:bg-indigo-500/20 group-hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto" value={complaint.likes}>
                  {likeId === complaint._id ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-indigo-400" />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z" />
                    </svg>
                  )}
                  {complaint.likes}
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
    </div>
  )
}

export default Home