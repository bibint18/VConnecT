// import axios from "axios";
import axiosInstance from "@/utils/axiosInterceptor";
export const signup = async (data) => {
    console.log("from auth: ", data);
    const response = await axiosInstance.post(`/signup`, data);
    return response.data;
};
export const verifyOtp = async (data) => {
    console.log("data to be passed ", data);
    const response = await axiosInstance.post(`/verify-otp`, data);
    return response.data;
};
