import { IRoom } from "../../../models/RoomModel";
import { IUser } from "../../../models/User";

export interface IRoomService{
  createRoom(roomData:IRoom):Promise<IRoom | null>
  getAllRooms(userId: string,
      page: number,
      limit: number,
      search?: string,
      type?: "PUBLIC" | "PRIVATE"):Promise<{ rooms: IRoom[], user: IUser | null, total: number }>
  joinRoom(RoomId:string,userId:string,secretCode:string):Promise<IRoom | null>
  deleteRoom(roomId:string):Promise<void>
}