import { IRoom } from "../../../models/RoomModel"

export interface IAdminRoomService{
  getAllRooms(page: number, limit: number, searchTerm: string, sortOption: string):Promise<IRoom[]>
  getTotalRooms(searchTerm: string):Promise<number>
  blockRoom(id: string):Promise<any>
  unblockRoom(id: string):Promise<any>
  deleteRoom(id: string): Promise<IRoom>;
  getRoomDetails(id:string):Promise<IRoom| null>
}