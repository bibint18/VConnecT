// import { Request,Response,NextFunction } from "express";
// import { ProfileService } from "../services/ProfileService";
// import { ProfileRepository } from "../repositories/ProfileRepository";
// import cloudinary from 'cloudinary'
// import { AppError } from "../utils/AppError";

// const profileService = new ProfileService(new ProfileRepository())
// cloudinary.v2.config({
//   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:process.env.CLOUDINARY_API_KEY,
//   api_secret:process.env.CLOUDINARY_API_SECRET
// })

// export class ProfileController{
//   private profileService:ProfileService
//   constructor(profileService:ProfileService){
//       this.profileService=profileService
//     }

// async getProfile(req:Request,res:Response,next:NextFunction){
//   try {
//     console.log("reached backend fetch profile")
//     const userId = (req as any).user.id
//     const user = await profileService.getUserProfile(userId)
//     console.log("user passed from backend",user)
//     res.json({user})
//   } catch (error) {
//     next(error)
//   }
// }

// async updateProfile(req:Request,res:Response,next:NextFunction) {
// try {
//   const id = (req as any ).user?.id
//   const profileData = req.body
//   const updatedUser = await profileService.updateUserProfile(id,profileData)
//   res.status(200).json({user:updatedUser,message:"Profile updated"})
// } catch (error) {
//   next(error)
// }
// }

//  async getCloudinarySignature(req:Request,res:Response,next:NextFunction) {
//   try {
//     const timestamp = Math.round(new Date().getTime()/1000)
//     const paramsToSign = {
//       timestamp: timestamp, 
//       folder: 'profile_images',
//       source: 'uw', 
//     };
//     const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string)
//     res.json({signature,timestamp})
//   } catch (error) {
//     next(error)
//   }
// }

// async getChatCloudinarySignature(req: Request, res: Response, next: NextFunction) { 
//   try {
//     const timestamp = Math.round(new Date().getTime() / 1000);
//     const paramsToSign = {
//       timestamp: timestamp,
//       folder: 'chat_media'
//       // source: 'uw',
//       // resource_type: 'auto' 
//     };
//     console.log("Signing parameters:", paramsToSign);
//     const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);
//     console.log("Generated signature:", signature);
//     res.json({ signature, timestamp });
//   } catch (error) {
//     console.error("Signature generation error:", error);
//     next(error);
//   }
// }

// async updateProfileImage (req:Request,res:Response,next:NextFunction) {
//   try {
//     console.log("backend update Profile image")
//     const id = (req as any).user?.id
//     const {imageUrl} = req.body
//     if(imageUrl && typeof imageUrl != 'string'){
//       throw new AppError("Invalid Image Type",400)
//     }
//     console.log("datas ",id,imageUrl)
//     const updatedUser = await profileService.updateProfileImage(id,imageUrl)
//     console.log("updated profile picture user ",updatedUser)
//     res.status(200).json({user:updatedUser,message:"Profile picture updated"})
//   } catch (error) {
//     next(error)  
//   }
// }


// async updateStreak (req:Request,res:Response,next:NextFunction) {
//   try {
//     console.log("reached backend streak")
//     const userId = (req as any).user.id
//     const updatedUser = await profileService.updateStreak(userId)
//     console.log(updatedUser)
//     res.status(200).json({user:updatedUser,message:"Streaks updated"})
//   } catch (error) {
//     next(error)
//   }
// }

// async changePassword(req: Request, res: Response, next: NextFunction) {
//   try {
//     console.log("reached here")
//     const userId = req.user?.id as string;
//     const { currentPassword, newPassword } = req.body;
//     if (!currentPassword || !newPassword) {
//       throw new AppError("Current and new passwords are required", 400);
//     }
//     const updatedUser = await profileService.changePassword(userId, currentPassword, newPassword);
//     res.status(200).json({ user: updatedUser, message: "Password updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// }

// }

// export default new ProfileController(new ProfileService(new ProfileRepository()))




import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services/ProfileService";
import { ProfileRepository } from "../repositories/ProfileRepository";
import cloudinary from 'cloudinary';
import { AppError } from "../utils/AppError";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export class ProfileController {
  private profileService: ProfileService;

  constructor(profileService: ProfileService) {
    this.profileService = profileService;
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached backend fetch profile");
      const userId = (req as any).user.id;
      const user = await this.profileService.getUserProfile(userId);
      console.log("user passed from backend", user);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as any).user?.id;
      const profileData = req.body;
      const updatedUser = await this.profileService.updateUserProfile(id, profileData);
      res.status(200).json({ user: updatedUser, message: "Profile updated" });
    } catch (error) {
      next(error);
    }
  }

  async getCloudinarySignature(req: Request, res: Response, next: NextFunction) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder: 'profile_images',
        source: 'uw',
      };
      const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);
      res.json({ signature, timestamp });
    } catch (error) {
      next(error);
    }
  }

  async getChatCloudinarySignature(req: Request, res: Response, next: NextFunction) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder: 'chat_media',
      };
      console.log("Signing parameters:", paramsToSign);
      const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);
      console.log("Generated signature:", signature);
      res.json({ signature, timestamp });
    } catch (error) {
      console.error("Signature generation error:", error);
      next(error);
    }
  }

  async updateProfileImage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("backend update Profile image");
      const id = (req as any).user?.id;
      const { imageUrl } = req.body;
      if (imageUrl && typeof imageUrl !== 'string') {
        throw new AppError("Invalid Image Type", 400);
      }
      console.log("datas ", id, imageUrl);
      const updatedUser = await this.profileService.updateProfileImage(id, imageUrl);
      console.log("updated profile picture user ", updatedUser);
      res.status(200).json({ user: updatedUser, message: "Profile picture updated" });
    } catch (error) {
      next(error);
    }
  }

  async updateStreak(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached backend streak");
      const userId = (req as any).user.id;
      const updatedUser = await this.profileService.updateStreak(userId);
      console.log(updatedUser);
      res.status(200).json({ user: updatedUser, message: "Streaks updated" });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached here");
      const userId = req.user?.id as string;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        throw new AppError("Current and new passwords are required", 400);
      }
      const updatedUser = await this.profileService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ user: updatedUser, message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController(new ProfileService(new ProfileRepository()));
