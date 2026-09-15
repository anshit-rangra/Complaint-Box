import api from "./axios"

export const getId = async() => {
    try {

        const res = await api.get("/complaint/id")


        return res?.data?.token
        
    } catch (error) {
        console.log(error)
    }
}