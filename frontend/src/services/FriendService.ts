import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";

export interface Friend {
  id: string;
}

export const getFriends = async (): Promise<Friend[]> => {
  try {
    const response = await axiosInstance.get("/user/friends");
    return response.data.friends;
  } catch (error: unknown) {
    if (error instanceof AxiosError) throw new Error(error.response?.data.message);
    else throw new Error("Failed to fetch friends");
  }
};