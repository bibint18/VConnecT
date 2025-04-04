import { NextFunction, Request, Response } from "express";

export interface IUserFriendController {
  getUserFriends(req: Request, res: Response,next:NextFunction): Promise<void>;
}