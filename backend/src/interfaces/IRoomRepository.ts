import { IRoom } from "../models/RoomModel";

export interface IRoomRepository{
  createRoom(roomData:IRoom):Promise<IRoom | null>
  getAllRooms():Promise<IRoom[] | null>
}