import { NextFunction, Request, Response } from "express";

export interface IAdminRoomController{
  getAllRooms(req: Request, res: Response, next: NextFunction):Promise<void>
  blockRoom(req: Request, res: Response, next: NextFunction):Promise<void>
  unblockRoom(req: Request, res: Response, next: NextFunction):Promise<void>
  deleteRoom(req: Request, res: Response, next: NextFunction):Promise<void>
  getRoomDetails(req: Request, res: Response, next: NextFunction):Promise<void>
}