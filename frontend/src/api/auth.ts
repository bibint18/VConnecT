import axios from "axios";
// import { data } from "react-router-dom";


const API_URL = "http://localhost:3000/api/auth"

export const signup=async (data: { name: string; email: string; password: string }) => {
  console.log("from auth: ",data)
  const response = await axios.post(`${API_URL}/signup`, data);
  return response.data;
}



export const verifyOtp = async(data:{email:string,name:string,password:string}) =>{
  console.log("data to be passed ",data)
  const response = await axios.post(`${API_URL}/verify-otp`,data)
      return response.data
}

// export const useVerifyOTP = () => {
//   return useMutation({
//     mutationFn:async(data:{email:string}) => {
//       const response = await axios.post(`${API_URL}/verify-otp`,data)
//       return response.data
//     }
//   })
// }

// export const useSignup = () => {
//   return useMutation({
//   });
// };