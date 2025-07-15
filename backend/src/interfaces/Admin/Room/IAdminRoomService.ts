import { RoomDetailsResponseDTO } from "../../../dtos/AdminRooms/RoomDetailsResponse.dto"
import { RoomListResponseDTO } from "../../../dtos/AdminRooms/RoomListResponse.dto"
import { RoomResponseDTO } from "../../../dtos/AdminRooms/RoomResponse.dto"
import { IRoom } from "../../../models/RoomModel"

export interface IAdminRoomService{
  getAllRooms(page: number, limit: number, searchTerm: string, sortOption: string):Promise<RoomListResponseDTO>
  getTotalRooms(searchTerm: string):Promise<number>
  blockRoom(id: string):Promise<RoomResponseDTO>
  unblockRoom(id: string):Promise<RoomResponseDTO>
  deleteRoom(id: string): Promise<IRoom>;
  getRoomDetails(id:string):Promise<RoomDetailsResponseDTO| null>
}