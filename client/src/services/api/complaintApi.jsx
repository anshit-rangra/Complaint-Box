import { useContext } from "react";
import api from "./axios"
import { TokenContext } from "../../context/TokenContext";


export const COMPLAINTS_PER_PAGE = 10

export const getComplaints = async (limit = COMPLAINTS_PER_PAGE, page = 1) => {

  try {

    const data = await api.get(`/complaint/get?limit=${limit}&page=${page}`)
    
    return data.data;
    
  } catch (error) { 
    console.error(error)
  }

}

export const postComplaint = async (title='', description='') => {
  try {

    const res = await api.post('/complaint/post', {title, description})

    return res
    
  } catch (error) {
    console.error(error)
  }
}

export const deleteComplaint = async (id) => {
  try {
    const res = await api.delete(`/complaint/delete/${id}`)
    return res.data;
  } catch (error) {
    console.error(error)
  }
}

export const likeComplaint = async (id) => {


  let token = localStorage.getItem("token")


  try {

    const res = await api.post(`/complaint/like/${id}`, {}, {
      headers: {
        'token': token
      }
    })
    return res.data;
  } catch (error) {
    console.error(error)
  }

}