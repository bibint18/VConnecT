import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export const getFriends = async () => {
    try {
        const response = await axiosInstance.get("/user/friends");
        return response.data.friends;
    }
    catch (error) {
        if (error instanceof AxiosError)
            throw new Error(error.response?.data.message);
        else
            throw new Error("Failed to fetch friends");
    }
};
