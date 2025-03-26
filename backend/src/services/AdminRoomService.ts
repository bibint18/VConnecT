import { IAdminRoomRepository } from "../interfaces/IAdminRoomRepository";
import { IRoom } from "../models/RoomModel";

export class AdminRoomService {
  private roomRepository: IAdminRoomRepository;

  constructor(roomRepository: IAdminRoomRepository) {
    this.roomRepository = roomRepository;
  }

  async getAllRooms(page: number, limit: number, searchTerm: string, sortOption: string) {
    const rooms = await this.roomRepository.getAllRooms(page, limit, searchTerm, sortOption);
    console.log(rooms ,"from service")
    return rooms
  }

  async getTotalRooms(searchTerm: string) {
    return await this.roomRepository.getTotalRooms(searchTerm);
  }

  async blockRoom(id: string) {
    return await this.roomRepository.blockRoom(id);
  }

  async unblockRoom(id: string) {
    return await this.roomRepository.unblockRoom(id);
  }

  async deleteRoom(id: string) {
    return await this.roomRepository.deleteRoom(id);
  }

  async getRoomDetails(id:string):Promise<IRoom | null>{
    return await this.roomRepository.getRoomDetails(id)
  }
}