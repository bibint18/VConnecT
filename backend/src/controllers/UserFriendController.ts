import { Request,Response,NextFunction } from "express";
import { IUserFriendController } from "../interfaces/IUserFriendController.js";
import { IUserFriendService } from "../interfaces/IUserFriendService.js";
import { AppError } from "../utils/AppError.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";

export class UserFriendController implements IUserFriendController{
  private userFriendService: IUserFriendService;
  constructor(userFriendService:IUserFriendService){
    this.userFriendService=userFriendService
  }
  async getUserFriends(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id
      if(!userId){
        throw new AppError("User not authenticated", HTTP_STATUS_CODE.UNAUTHORIZED);
      }
      const friends = await this.userFriendService.getUserFriends(userId)
      res.status(HTTP_STATUS_CODE.OK).json({success:true,data:friends})
    } catch (error) {
      next(error)
    }
  }
}