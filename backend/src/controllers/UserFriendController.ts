import { Request,Response,NextFunction } from "express";
import { IUserFriendController } from "../interfaces/IUserFriendController";
import { IUserFriendService } from "../interfaces/IUserFriendService";
import { AppError } from "../utils/AppError";

export class UserFriendController implements IUserFriendController{
  private userFriendService: IUserFriendService;
  constructor(userFriendService:IUserFriendService){
    this.userFriendService=userFriendService
  }
  async getUserFriends(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id
      if(!userId){
        throw new AppError("User not authenticated", 401);
      }
      const friends = await this.userFriendService.getUserFriends(userId)
      // console.log("friendssssssssssssss",friends)
      res.status(200).json({success:true,data:friends})
    } catch (error) {
      next(error)
    }
  }
}