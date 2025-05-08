import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export const fetchUserFriends = async () => {
    try {
        const response = await axiosInstance.get('/user/chat/friends');
        console.log("response from service friends", response.data.data);
        return response.data.data;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "Failed to fetch friends");
        }
        throw new Error("Failed to fetch friends");
    }
};
