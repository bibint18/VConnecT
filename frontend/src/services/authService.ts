
import axiosInstance from "../utils/axiosInterceptor";
import {store} from '../redux/store'
import { AxiosError } from "axios";
export const loginUser = async(email:string,password:string,recaptchaToken:string) => {
  try{
  console.log("hereeeeeeeeeeeeeee")
  console.log("datas: ",email,password,recaptchaToken)
  console.log("password and length",password,password.length)
  const response = await axiosInstance.post("/login",{
    email,
    password,
    recaptchaToken
  })
  console.log("passed from here")
  return response.data
  }catch(error:unknown){
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message); // Forward backend error to frontend
    }
    throw new Error("Something went wrong. Please try again.");
  } 
}

export const loginAdmin = async (email:string,password:string) => {
  const response=await axiosInstance.post('/adminLogin',{
    email,
    password
  })
  return response.data
}

export const adminLogout = async () => {
  try {
    await axiosInstance.post('/adminLogout')
  } catch (error) {
    console.error(error)
  }
  document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  store.dispatch({type:"auth/logout"})
  window.location.href='/adminLogin'
}