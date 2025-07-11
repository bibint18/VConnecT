import { IRoom } from "../models/RoomModel.js";
import { IUser } from "../models/User.js";

export interface IRoomRepository{
  createRoom(roomData:IRoom):Promise<IRoom | null>
  getAllRooms(userId: string,
    page: number,
    limit: number,
    search?: string,
    type?: "PUBLIC" | "PRIVATE" | "MY"):Promise<{ rooms: IRoom[]; user: IUser | null; total: number }>;
  joinRoom(RoomId:string,userId:string,secretCode:string):Promise<IRoom | null>
  deleteRoom(roomId:string):Promise<void>
}