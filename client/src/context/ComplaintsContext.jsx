import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { getComplaints, COMPLAINTS_PER_PAGE } from "../services/api/complaintApi"


export const complaintsContext = createContext()


const ComplaintsProvider = ({ children }) => {

    const [complaintsData, setComplaintsData] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)

    const fetchComplaints = useCallback(async (page = 1) => {

        setLoading(true)

        const res = await getComplaints(COMPLAINTS_PER_PAGE, page)

        if (res?.data) {
            setComplaintsData(res.data)
            setCurrentPage(page)
            setTotalPages(Math.max(1, Math.ceil(res.data.total / COMPLAINTS_PER_PAGE)))
        }

        setLoading(false)

    }, [])

    useEffect(() => {
        (async function(){
            await fetchComplaints(1)
        })()
    }, [fetchComplaints])

    const value = useMemo(() => ({
        complaintsData,
        setComplaintsData,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        loading,
        fetchComplaints
    }), [complaintsData, currentPage, totalPages, loading, fetchComplaints])

    return (
            <complaintsContext.Provider value={value}>
                { children }
            </complaintsContext.Provider>
            )
}

export default ComplaintsProvider