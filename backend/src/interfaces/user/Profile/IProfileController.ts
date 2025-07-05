import { Request, Response, NextFunction } from "express";

export interface IProfileController {
  getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCloudinarySignature(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getChatCloudinarySignature(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateStreak(req: Request, res: Response, next: NextFunction): Promise<void>;
  changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
