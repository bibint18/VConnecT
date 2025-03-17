import { Request,Response,NextFunction } from "express";
import { ProfileService } from "../services/ProfileService";
import { ProfileRepository } from "../repositories/ProfileRepository";
import cloudinary from 'cloudinary'
import { AppError } from "../utils/AppError";

const profileService = new ProfileService(new ProfileRepository())
cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

export const getProfile = async(req:Request,res:Response,next:NextFunction) => {
  try {
    console.log("reached backend fetch profile")
    const userId = (req as any).user.id
    const user = await profileService.getUserProfile(userId)
    console.log("user passed from backend",user)
    res.json({user})
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async(req:Request,res:Response,next:NextFunction) => {
try {
  const id = (req as any ).user?.id
  const profileData = req.body
  const updatedUser = await profileService.updateUserProfile(id,profileData)
  res.status(200).json({user:updatedUser,message:"Profile updated"})
} catch (error) {
  next(error)
}
}

export const getCloudinarySignature = async(req:Request,res:Response,next:NextFunction) => {
  try {
    const timestamp = Math.round(new Date().getTime()/1000)
    const paramsToSign = {
      timestamp: timestamp, // Match Cloudinary's expected key
      folder: 'profile_images', // Match frontend
      source: 'uw', // Match sources: ['local'] from frontend
    };
    const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string)
    res.json({signature,timestamp})
  } catch (error) {
    next(error)
  }
}

export const updateProfileImage = async (req:Request,res:Response,next:NextFunction) => {
  try {
    console.log("backend update Profile image")
    const id = (req as any).user?.id
    const {imageUrl} = req.body
    if(imageUrl && typeof imageUrl != 'string'){
      throw new AppError("Invalid Image Type",400)
    }
    console.log("datas ",id,imageUrl)
    const updatedUser = await profileService.updateProfileImage(id,imageUrl)
    console.log("updated profile picture user ",updatedUser)
    res.status(200).json({user:updatedUser,message:"Profile picture updated"})
  } catch (error) {
    next(error)  
  }
}
