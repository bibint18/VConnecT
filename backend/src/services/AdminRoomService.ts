import { RoomDetailsResponseDTO } from "../dtos/AdminRooms/RoomDetailsResponse.dto.js";
import { RoomListResponseDTO } from "../dtos/AdminRooms/RoomListResponse.dto.js";
import { RoomResponseDTO } from "../dtos/AdminRooms/RoomResponse.dto.js";
import { IAdminRoomService } from "../interfaces/Admin/Room/IAdminRoomService.js";
import { IAdminRoomRepository } from "../interfaces/IAdminRoomRepository.js";
import { RoomMapper } from "../mappers/AdminRooms/AdminRoomMapper.js";
import { IRoom } from "../models/RoomModel.js";

export class AdminRoomService implements IAdminRoomService {
  private roomRepository: IAdminRoomRepository;

  constructor(roomRepository: IAdminRoomRepository) {
    this.roomRepository = roomRepository;
  }

  async getAllRooms(
    page: number,
    limit: number,
    searchTerm: string,
    sortOption: string
  ): Promise<RoomListResponseDTO> {
    const rooms = await this.roomRepository.getAllRooms(
      page,
      limit,
      searchTerm,
      sortOption
    );
    const totalRooms = await this.roomRepository.getTotalRooms(searchTerm)
    return RoomMapper.toRoomListResponse(rooms,totalRooms)
  }

  async getTotalRooms(searchTerm: string): Promise<number> {
    return await this.roomRepository.getTotalRooms(searchTerm);
  }

  async blockRoom(id: string): Promise<RoomResponseDTO> {
    const room=await this.roomRepository.blockRoom(id);
    return RoomMapper.toRoomResponse(room)
  }

  async unblockRoom(id: string): Promise<RoomResponseDTO> {
   const room= await this.roomRepository.unblockRoom(id);
   return RoomMapper.toRoomResponse(room)
  }

  async deleteRoom(id: string): Promise<IRoom> {
    return await this.roomRepository.deleteRoom(id);
  }

  async getRoomDetails(id: string): Promise<RoomDetailsResponseDTO | null> {
    const room=await this.roomRepository.getRoomDetails(id);
    return room ? RoomMapper.toRoomDetailsResponse(room) : null
  }
}
