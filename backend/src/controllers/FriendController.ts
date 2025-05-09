import { Request, Response, NextFunction } from "express";
import { IFriendRepository } from "../interfaces/IFriendRepository.js";
import { AppError } from "../utils/AppError.js";
import { User } from "../models/User.js";

export class FriendController {
  private friendRepository: IFriendRepository;

  constructor(friendRepository: IFriendRepository) {
    this.friendRepository = friendRepository;
  }

  public getPendingRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('backend friend request')
      const userId = (req as any).user.id; 
      if (!userId) throw new AppError("Unauthorized", 401);

      const requests = await this.friendRepository.getPendingRequests(userId);
      res.status(200).json({ requests });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError("Failed to fetch friend requests", 500));
    }
  };

  async getFriends(req:Request,res:Response,next:NextFunction) {
    try {
      const userId = (req as any).user?.id
      if(!userId){
        throw new Error("Unauthorized")
      }
      const user = await User.findById(userId).select("friends").populate("friends", "_id name");
      console.log("controller friendsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",user)
      if(!user){
        throw new Error("no user")
      }
      res.status(200).json({ friends: user.friends.map(f => ({ id: f._id.toString() })) });
    } catch (error) {
      next(error)
    }
  }
}

