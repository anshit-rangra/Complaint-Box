import { createContext, useEffect, useState } from "react"
import { getComplaints } from "../services/api/complaintApi"


export const complaintsContext = createContext()


const ComplaintsProvider = ({ children }) => {

    const [complaintsData, setComplaintsData] = useState(null)


     useEffect(() => {
        (async function(){
            let res = await getComplaints()
            setComplaintsData(res.data)
        })()
     }, [])


    return (
            <complaintsContext.Provider value={{ complaintsData, setComplaintsData }}>
                { children }
            </complaintsContext.Provider>
            )
}

export default ComplaintsProvider