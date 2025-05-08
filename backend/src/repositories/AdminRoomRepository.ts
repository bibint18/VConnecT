
import { IAdminRoomRepository } from "../interfaces/IAdminRoomRepository";
import { IRoom, Room } from "../models/RoomModel";
import { AppError } from "../utils/AppError";

export class AdminRoomRepository implements IAdminRoomRepository{
  async getAllRooms(page: number, limit: number, searchTerm: string, sortOption: string): Promise<IRoom[]> {
    console.log("reached repo admin room",page,limit,searchTerm,sortOption)
    const query:any = {}
    if(searchTerm){
      query.title={$regex:searchTerm,$options:'i'}
    }
    let sortQuery:any = {}
    if(sortOption==='public'){
      query.type='PUBLIC'
      sortQuery={title:1}
    }else if (sortOption === "private") {
      query.type = "PRIVATE";
      sortQuery = { title: 1 };
    }else if(sortOption==='all'){
      sortQuery={title:1}
    }
    const rooms = await Room.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("createdBy", "name email")
      .exec();
      console.log("rooms from repo",rooms)
    return rooms
  }

  async getTotalRooms(searchTerm: string): Promise<number> {
    const query: any = { isDeleted: false };
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" };
    }
    return await Room.countDocuments(query);
  }

  async blockRoom(id: string): Promise<IRoom> {
    const room = await Room.findByIdAndUpdate(id, { isBlocked: true }, { new: true }).exec();
    if (!room) throw new AppError("Room not found", 404);
    return room;
  }

  async unblockRoom(id: string): Promise<IRoom> {
    const room = await Room.findByIdAndUpdate(id, { isBlocked: false }, { new: true }).exec();
    if (!room) throw new AppError("Room not found", 404);
    return room;
  }

  async deleteRoom(id: string): Promise<IRoom> {
    const room = await Room.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
    if (!room) throw new AppError("Room not found", 404);
    return room;
  }

  async getRoomDetails(id: string): Promise<IRoom | null> {
    const room = await Room.findById(id)
    .populate('createdBy','name email')
    .populate('participants.userId','name email')
    .exec()
    if(!room) throw new AppError("Room not found",404)
    return room
  }
}