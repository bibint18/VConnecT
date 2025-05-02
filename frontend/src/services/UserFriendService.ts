import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";

export interface IFriend{
  id:string;
  name:string;
  avatar:string;
  lastMessage:string;
  timestamp:string;
  isOnline:boolean;
  unreadCount:number;
  fullTimestamp:Date;
}

export const fetchUserFriends = async ():Promise<IFriend[]> => {
  try {
    const response = await axiosInstance.get('/user/chat/friends')
    console.log("response from service friends",response.data.data)
    return response.data.data
  } catch (error:unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Failed to fetch friends");
    }
    throw new Error("Failed to fetch friends");
  }
}