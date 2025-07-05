import { IAdminRoomService } from "../interfaces/Admin/Room/IAdminRoomService.js";
import { IAdminRoomRepository } from "../interfaces/IAdminRoomRepository.js";
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
  ): Promise<IRoom[]> {
    const rooms = await this.roomRepository.getAllRooms(
      page,
      limit,
      searchTerm,
      sortOption
    );
    console.log(rooms, "from service");
    return rooms;
  }

  async getTotalRooms(searchTerm: string): Promise<number> {
    return await this.roomRepository.getTotalRooms(searchTerm);
  }

  async blockRoom(id: string): Promise<any> {
    return await this.roomRepository.blockRoom(id);
  }

  async unblockRoom(id: string): Promise<any> {
    return await this.roomRepository.unblockRoom(id);
  }

  async deleteRoom(id: string): Promise<IRoom> {
    return await this.roomRepository.deleteRoom(id);
  }

  async getRoomDetails(id: string): Promise<IRoom | null> {
    return await this.roomRepository.getRoomDetails(id);
  }
}
