import axiosInstance from "@/utils/axiosInterceptor";
import {  AxiosError } from "axios";

interface IUserProfile {
  name:string;
  email: string;
  googleId?: string;
  mobile?: string;
  username?: string;
  country?: string;
  description?: string;
  gender?: string;
}
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

export const updateUserProfile = async (profileData: Partial<IUserProfile>) => {
  try {
    const response = await axiosInstance.put('/user/profile/edit',profileData)
    return response.data
  } catch (error) {
    if(error instanceof AxiosError && error.response){
      throw new Error(error.response.data.message)
    }
    throw new Error("Failed to update user Profile")
  }
}

export const userCheckin = async () => {
  try {
    const response = await axiosInstance.post('/user/profile/streak')
    return response.data.user
  } catch (error) {
    if(error instanceof AxiosError){
      throw new Error(error.response?.data.message)
    }else{
      throw new Error("Failed to update Streaks")
    }
  }
}

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  try {
    const response = await axiosInstance.post('/user/profile/change-password', data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to change password");
  }
};