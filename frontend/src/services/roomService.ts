import { RoomFormData } from "@/components/User/Room/AddRoom";
import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export const createRoom = async (RoomData:RoomFormData) => {
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

export const getAllRooms = async (page: number = 1,
  limit: number = 10,
  search: string = "",
  type: "PUBLIC" | "MY" | "PRIVATE" | "" = "") => {
  const response = await axiosInstance.get('/user/rooms',{params: {page, limit, search, type}})
  return response.data
}

export const joinRoom = async(roomId:string,secretCode?:string) => {
  try {
    const response = await axiosInstance.post('/user/room/join',{roomId,secretCode})
    return response.data
  } catch (error:unknown) {
    if(error instanceof AxiosError){
      throw new Error(error.response?.data.message)
    }else{
      throw new Error("Failed to join room")
    }
  }
}



// export interface Participant {
//   userId: { name: string; email: string };
//   firstJoin: Date;
//   lastJoin: Date;
//   lastLeave: Date | null;
//   totalDuration: number; 
// }

// export interface IDetailRoom {
//   _id: string;
//   title: string;
//   createdBy: { name: string; email: string }
//   limit: number;
//   participants: Participant[];
//   createdAt: Date;
//   type: "PUBLIC" | "PRIVATE";
//   premium: boolean;
//   isBlocked?:boolean;
//   secretCode?:string;
//   description: string;
// }

interface Participant {
  name: string;
  email: string;
  firstJoin: string;
  lastJoin: string;
  lastLeave?: string;
  totalDuration: number;
}

export interface RoomDetailsResponse {
  room: {
    _id: string;
    title: string;
    type: "PUBLIC" | "PRIVATE";
    limit: number;
    premium: boolean;
    description: string;
    createdByName: string;
    createdByEmail: string;
    createdAt: string;
    isBlocked: boolean;
    secretCode?: string;
    participants: Participant[];
  };
}
export const getRoomDetails = async (roomId: string): Promise<RoomDetailsResponse> => {
  const response = await axiosInstance.get(`/admin/room/details/${roomId}`, { withCredentials: true });
  return response.data;
};

export const deleteRoom = async (roomId:string):Promise<void> => {
  const response = await axiosInstance.delete(`/user/room/${roomId}`)
  return response.data
}