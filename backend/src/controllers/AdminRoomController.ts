import { Request, Response, NextFunction } from "express";
import { AdminRoomService } from "../services/AdminRoomService.js";
import { AdminRoomRepository } from "../repositories/AdminRoomRepository.js";

const roomService = new AdminRoomService(new AdminRoomRepository());
export class AdminRoomController{
  private adminRoomService:AdminRoomService
  constructor(adminRoomService:AdminRoomService){
    this.adminRoomService=adminRoomService
  }
async getAllRooms (req: Request, res: Response, next: NextFunction) {
  try {
    console.log('reached')
    const { page = 1, limit = 6, searchTerm = "", sortOption = "public" } = req.query;
    console.log(req.query)
    const rooms = await roomService.getAllRooms(Number(page), Number(limit), String(searchTerm), String(sortOption));
    const totalRooms = await roomService.getTotalRooms(String(searchTerm));
    console.log("Rooms passed from controller admin",rooms,totalRooms)
    res.status(200).json({ rooms, totalRooms });
  } catch (error) {
    next(error);
  }
};

async blockRoom (req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const room = await roomService.blockRoom(id);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

async unblockRoom (req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const room = await roomService.unblockRoom(id);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

async deleteRoom (req: Request, res: Response, next: NextFunction){
  try {
    const { id } = req.params;
    const room = await roomService.deleteRoom(id);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

async getRoomDetails(req:Request,res:Response,next:NextFunction){
  try {
    const {id} = req.params
    const room= await this.adminRoomService.getRoomDetails(id)
    res.status(200).json({room})
  } catch (error) {
    next(error)
  }
}

}

export default new AdminRoomController(new AdminRoomService(new AdminRoomRepository()))