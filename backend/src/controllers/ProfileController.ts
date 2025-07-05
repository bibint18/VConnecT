import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services/ProfileService.js";
import { ProfileRepository } from "../repositories/ProfileRepository.js";
import cloudinary from "cloudinary";
import { AppError } from "../utils/AppError.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";
import { IProfileController } from "../interfaces/user/Profile/IProfileController.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ProfileController implements IProfileController {
  private profileService: ProfileService;

  constructor(profileService: ProfileService) {
    this.profileService = profileService;
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await this.profileService.getUserProfile(userId);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = (req as any).user?.id;
      const profileData = req.body;
      const updatedUser = await this.profileService.updateUserProfile(
        id,
        profileData
      );
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ user: updatedUser, message: "Profile updated" });
    } catch (error) {
      next(error);
    }
  }

  async getCloudinarySignature(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder: "profile_images",
        source: "uw",
      };
      const signature = cloudinary.v2.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET as string
      );
      res.json({ signature, timestamp });
    } catch (error) {
      next(error);
    }
  }

  async getChatCloudinarySignature(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder: "chat_media",
      };
      const signature = cloudinary.v2.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET as string
      );
      res.json({ signature, timestamp });
    } catch (error) {
      console.error("Signature generation error:", error);
      next(error);
    }
  }

  async updateProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = (req as any).user?.id;
      const { imageUrl } = req.body;
      if (imageUrl && typeof imageUrl !== "string") {
        throw new AppError("Invalid Image Type", 400);
      }
      const updatedUser = await this.profileService.updateProfileImage(
        id,
        imageUrl
      );
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ user: updatedUser, message: "Profile picture updated" });
    } catch (error) {
      next(error);
    }
  }

  async updateStreak(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const updatedUser = await this.profileService.updateStreak(userId);
      console.log(updatedUser);
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ user: updatedUser, message: "Streaks updated" });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        throw new AppError(
          "Current and new passwords are required",
          HTTP_STATUS_CODE.BAD_REQUEST
        );
      }
      const updatedUser = await this.profileService.changePassword(
        userId,
        currentPassword,
        newPassword
      );
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ user: updatedUser, message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController(
  new ProfileService(new ProfileRepository())
);
