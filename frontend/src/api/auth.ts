
import axiosInstance from "@/utils/axiosInterceptor";

export const signup=async (data: { name: string; email: string; password: string }) => {
  console.log("from auth: ",data)
  const response = await axiosInstance.post(`/signup`, data);
  return response.data;
}

export const verifyOtp = async(data:{email:string,name:string,password:string}) =>{
  console.log("data to be passed ",data)
  const response = await axiosInstance.post(`/verify-otp`,data)
      return response.data
}

