import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";

export const getUserProfile = async () => {
  try{
  const response = await axiosInstance.get('/user/profile')
  return response.data.user
  }catch(error:unknown){
    if(error instanceof AxiosError && error.message){
      throw new Error(error.response?.data.message)
    }
    throw new Error("Failed to fetch profile")
  }
}