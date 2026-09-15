import { useContext, useState } from 'react'
import { postComplaint } from '../services/api/complaintApi'
import { toast } from 'react-toastify'
import { complaintsContext } from '../context/ComplaintsContext'

const Form = ({ onClose }) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const { setComplaintsData } = useContext(complaintsContext)

  const notify = (m) => toast(m);

  const handleSubmit = async (e) => {
    e.preventDefault()


    try {
      if (!title.trim() || !body.trim()) return
      
      const { data } = await postComplaint(title, body)
      notify(data.message)


      setComplaintsData(prev => {
        return { complaints: [ ...prev.complaints, data.complaint ], total: prev.total+1, page: prev.page}})



      

      
    } catch (error) {
      console.error(error)
      notify("Error")

    } finally {

    setTitle('')
    setBody('')
    onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 cursor-pointer text-slate-400 transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="mb-5 text-lg font-bold text-white">Add New Complaint</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-300">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter complaint title"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="body" className="mb-1 block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your complaint..."
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-opacity hover:opacity-90"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  )
}

export default Form
