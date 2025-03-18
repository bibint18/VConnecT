import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
import { FormData } from "@/components/User/Room/AddRoom";
// interface RoomData{
//   title:string;
//   limit:number;
//   isPremium:string;
//   type:'PUBLIC' | "PRIVATE";
//   description:string
// }

export const createRoom = async (RoomData:FormData) => {
  try {
    const response = await axiosInstance.post('/user/room/create',RoomData)
    return response.data
  } catch (error:unknown) {
    if(error instanceof AxiosError){
      throw Error(error.response?.data.message)
    }else{
      throw Error("Failed to create Room")
    }
  }
}

export const getAllRooms = async () => {
  const response = await axiosInstance.get('/user/rooms')
  return response.data
}