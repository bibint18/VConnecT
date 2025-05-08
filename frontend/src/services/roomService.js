import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
// import FormData  from "@/components/User/Room/AddRoom";
// interface RoomData{
//   title:string;
//   limit:number;
//   isPremium:string;
//   type:'PUBLIC' | "PRIVATE";
//   description:string
// }
export const createRoom = async (RoomData) => {
    try {
        const response = await axiosInstance.post('/user/room/create', RoomData);
        return response.data;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            throw Error(error.response?.data.message);
        }
        else {
            throw Error("Failed to create Room");
        }
    }
};
export const getAllRooms = async (page = 1, limit = 10, search = "", type = "") => {
    const response = await axiosInstance.get('/user/rooms', { params: { page, limit, search, type } });
    return response.data;
};
export const joinRoom = async (roomId, secretCode) => {
    try {
        console.log("join rookm service", roomId, secretCode);
        const response = await axiosInstance.post('/user/room/join', { roomId, secretCode });
        console.log("response from join room", response);
        return response.data;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        else {
            throw new Error("Failed to join room");
        }
    }
};
export const getRoomDetails = async (roomId) => {
    const response = await axiosInstance.get(`/admin/room/details/${roomId}`, { withCredentials: true });
    return response.data;
};
