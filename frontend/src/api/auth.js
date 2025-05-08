// import axios from "axios";
import axiosInstance from "@/utils/axiosInterceptor";
const API_URL = "http://localhost:3000/api/auth";
export const signup = async (data) => {
    console.log("from auth: ", data);
    const response = await axiosInstance.post(`${API_URL}/signup`, data);
    return response.data;
};
export const verifyOtp = async (data) => {
    console.log("data to be passed ", data);
    const response = await axiosInstance.post(`${API_URL}/verify-otp`, data);
    return response.data;
};
