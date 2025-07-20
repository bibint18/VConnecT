
import axiosInstance from "../utils/axiosInterceptor";
import {store} from '../redux/store'
import { AxiosError } from "axios";
import {logoutTheUser } from "../redux/userSlice";
import { logout } from "../redux/authSlice";

export const loginUser = async(email:string,password:string,recaptchaToken:string) => {
  try{
  const response = await axiosInstance.post("/login",{
    email,
    password,
    recaptchaToken
  })
  const {accessToken,user} = response.data
  console.log("service folder ",accessToken,user)
  return response.data
  }catch(error:unknown){
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message); 
    }
    throw new Error("Something went wrong. Please try again.");
  } 
}

export const logoutUser = async () => {
  try {
    await axiosInstance.post('/logout')
    store.dispatch(logoutTheUser())
    window.location.href='/'
  } catch (error) {
    console.error(error)
  }
}

export const loginAdmin = async (email:string,password:string) => {
  const response=await axiosInstance.post('/adminLogin',{
    email,
    password,
  })
  return response.data
  
}

export const adminLogout = async () => {
  try {
    
    await axiosInstance.post('/adminLogout')
    store.dispatch(logout())
    window.location.href='/adminLogin'
  } catch (error) {
    console.error(error)
  }
}