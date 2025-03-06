
import axiosInstance from "../utils/axiosInterceptor";
import axios from "axios";
export const loginUser = async(email:string,password:string,recaptchaToken:string) => {
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
}

export const loginAdmin = async (email:string,password:string) => {
  const response=await axios.post('http://localhost:3000/api/admin/adminLogin',{
    email,
    password
  })
  return response.data
}