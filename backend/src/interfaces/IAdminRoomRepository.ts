import { IRoom, Room } from "../models/RoomModel";
import { IUser } from "../models/User";

export interface IAdminRoomRepository{
  getAllRooms(page:number,limit:number,searchTerm:string,sortOption:string):Promise<IRoom[]>
  getTotalRooms(searchTerm:string):Promise<number>
  blockRoom(roomid:string):Promise<any>
  unblockRoom(roomid:string):Promise<any>
  deleteRoom(id: string): Promise<IRoom>;
  getRoomDetails(id:string):Promise<IRoom | null>
}