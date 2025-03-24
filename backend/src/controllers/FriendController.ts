import { Request, Response, NextFunction } from "express";
import { IFriendRepository } from "../interfaces/IFriendRepository";
import { AppError } from "../utils/AppError";

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
}

