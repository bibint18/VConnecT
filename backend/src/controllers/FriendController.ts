import { Request, Response, NextFunction } from "express";
import { IFriendRepository } from "../interfaces/IFriendRepository.js";
import { AppError } from "../utils/AppError.js";
import { User } from "../models/User.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";

export class FriendController {
  private friendRepository: IFriendRepository;

  constructor(friendRepository: IFriendRepository) {
    this.friendRepository = friendRepository;
  }

  public getPendingRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      if (!userId)
        throw new AppError("Unauthorized", HTTP_STATUS_CODE.UNAUTHORIZED);

      const requests = await this.friendRepository.getPendingRequests(userId);
      res.status(HTTP_STATUS_CODE.OK).json({ requests });
    } catch (error) {
      next(
        error instanceof AppError
          ? error
          : new AppError(
              "Failed to fetch friend requests",
              HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
            )
      );
    }
  };

  async getFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error("Unauthorized");
      }
      const user = await User.findById(userId)
        .select("friends")
        .populate("friends", "_id name");
      if (!user) {
        throw new Error("no user");
      }
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ friends: user.friends.map((f) => ({ id: f._id.toString() })) });
    } catch (error) {
      next(error);
    }
  }
}
